import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import {
    PublishOptions, Conference, ConferenceMode, Stream, ConferenceSession,
    StreamType, Auvious, JoinConferenceOptions, Endpoint
} from 'auvious-focus-client-js'

import { SipService } from './sip.service';
import { StateService } from './state.service';
import { RecorderService } from './recorder.service';

import { debug, rtcninja, isUsingTemasysPlugin2, attachMediaStream2 } from './utils';

declare var chrome;

@Component({
    selector: 'conference',
    templateUrl: './conference.component.html'
})
export class ConferenceComponent implements OnInit, OnDestroy {
    title = 'Conference Component'

    warning: string;
    conference: Conference;
    session: ConferenceSession;
    myself: Endpoint
    participants: Object;
    streams: any;
    sub: any;
    sipService: Auvious;

    recording: boolean;

    elemArray: HTMLMediaElement[] = [];

    constructor(
        private sipServiceContainer: SipService,
        private stateService: StateService,
        private recorderService: RecorderService,
        private router: Router,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private sanitizer: DomSanitizer,
        private cdRef: ChangeDetectorRef
    ) {
        this.sipService = sipServiceContainer.client;
        this.participants = {};
        this.streams = {};
        this.recording = false;
    }

    ngOnInit() {
        debug("conference ngOnInit");

        if (!this.sipService.registered() && !this.sipService.connected()) {
            this.route.params.subscribe(params => {
                let username = params['username'] as string;

                if (!username) {
                    this.router.navigate(['/register']);
                } else {
                    let options = {
                        focusUrl: this.sipServiceContainer.focusUrl,
                        username: username
                    }

                    this.sipService.register(options)
                        .then(() => this.ngOnInit2())
                        .catch((error: Error) => alert(error.message));
                }
            });
        } else {
            this.ngOnInit2()
        }
    }

    ngOnInit2() {
        this.myself = {
            username: this.sipService.identity(),
            endpoint: this.sipService.endpoint()
        };

        this.sipService.on('newConferenceSession', (session) => this.ngZone.run(() => this.session = session));

        this.sipService.on('warning', (warning) => {
            debug('warning: ', warning);

            this.ngZone.run(() => this.warning = warning);
            setTimeout(() => this.warning = null, 5000);
        });

        this.sipService.on('registrationFailed', (error) => {
            debug("registration failed: ", error);
            alert("Registration Failed!")
            this.router.navigate(['/register'])
        });

        this.sipService.on('newSession', (session) => this.ngZone.run(() => {
            debug('warning: new session', session);

            this.ngZone.run(() => this.warning = "warning new session");
            setTimeout(() => this.warning = null, 5000);
        }));

        this.sipService.on('registered', () => this.ngZone.run(() => {
            debug('warning: re-registered');

            this.ngZone.run(() => this.warning = "re-registered");
            setTimeout(() => this.warning = null, 5000);
        }));

        this.sub = this.route.params.subscribe(params => {
            let id = params['id'] as string;

            this.conference = {
                name: id,
                mode: ConferenceMode.UNKNOWN
            };

            let eventHandlers = {
                connecting: () => debug(`connecting to conference ${this.conference.name}`),
                accepted: (session: ConferenceSession) => {
                    debug('accepted', session);
                    this.ngZone.run(() => this.conference.mode = session.conference.mode);
                },
                endpointJoined: (endpoint: Endpoint) => {
                    debug('endpoint joined', endpoint)
                    this.ngZone.run(() => this.participants[endpoint.endpoint] = endpoint)
                },
                endpointLeft: (endpoint: Endpoint) => {
                    debug('endpoint left', endpoint);
                    this.ngZone.run(() => {
                        delete this.participants[endpoint.endpoint];
                        debug('removed participant', endpoint);
                    });
                },
                streamAdded: (stream: Stream) => {
                    debug('stream added', stream);
                    if (!this.streams[stream.originator.endpoint]) {
                        this.streams[stream.originator.endpoint] = new Object();
                    }
                    this.ngZone.run(() => this.streams[stream.originator.endpoint][stream.type] = stream);
                    this.cdRef.detectChanges();
                    let id = `${stream.originator.endpoint}-${stream.type}`;
                    let videoElement = document.getElementById(id) as HTMLVideoElement;

                    if (isUsingTemasysPlugin2()) {
                        attachMediaStream2(videoElement, stream.mediaStream);
                    } else {
                        this.ngZone.run(() => {
                            videoElement.srcObject = stream.mediaStream;
                            this.play(videoElement);
                        });
                    }
                    debug(`stream attached to ${id}`);
                },
                streamRemoved: (stream: Stream) => {
                    debug('stream removed', stream);
                    rtcninja.closeMediaStream(stream.mediaStream);
                    delete this.streams[stream.originator.endpoint][stream.type];
                    let id = `${stream.originator.endpoint}-${stream.type}`;
                    let videoElement = document.getElementById(id);
                    videoElement.parentNode.removeChild(videoElement);
                },
                failed: (error) => {
                    debug('conference failed', error);
                    alert("conference call failed");
                    this.closeStreams();
                    this.router.navigate(['/phone']);
                },
                ended: () => {
                    debug('conference session ended');
                    alert("conference call ended");
                    this.closeStreams();
                    this.router.navigate(['/phone']);
                }
            };

            // join conference
            this.sipService.joinConference({ id: this.conference.name, eventHandlers: eventHandlers });
        })
    }

    ngOnDestroy() {
        !!this.sub && this.sub.unsubscribe()
    }

    leaveConference(): void {
        //this.unpublishStreams();
        this.session.leave();
        this.session = null
    }

    endConference(): void {
        //this.unpublishStreams();
        this.session.terminate();
        this.session = null;
    }

    outgoingCallInProgress() {
        return this.callInProgress() && this.session.direction == 'outgoing'
    }

    incomingCallInProgress() {
        return this.callInProgress() && this.session.direction == 'incoming'
    }

    callInProgress() {
        return !!this.session && this.session.isInProgress();
    }

    establishedCall() {
        return !!this.session && this.session.isEstablished();
    }

    streamCaption(endpoint: Endpoint): string {
        let result: string[] = [];

        if (this.hasMicrophone(endpoint)) {
            result.push('A');
        }

        if (this.hasCamera(endpoint)) {
            result.push('V');
        }

        if (this.hasVideo(endpoint)) {
            result.push('AV');
        }

        if (this.hasScreen(endpoint)) {
            result.push('S');
        }

        return result.join('-');
    }

    hasMicrophone(endpoint: Endpoint): boolean {
        return !!endpoint && !!this.streams[endpoint.endpoint]
            && !!this.streams[endpoint.endpoint][StreamType.MIC];
    }

    hasCamera(endpoint: Endpoint): boolean {
        return !!endpoint && !!this.streams[endpoint.endpoint]
            && !!this.streams[endpoint.endpoint][StreamType.CAM];
    }

    hasVideo(endpoint: Endpoint): boolean {
        return !!endpoint && !!this.streams[endpoint.endpoint]
            && !!this.streams[endpoint.endpoint][StreamType.VIDEO];
    }

    hasScreen(endpoint: Endpoint): boolean {
        return !!endpoint && !!this.streams[endpoint.endpoint]
            && !!this.streams[endpoint.endpoint][StreamType.SCREEN];
    }

    isMicOn(): boolean {
        return this.hasMicrophone(this.myself);
    }

    isCameraOn(): boolean {
        return this.hasCamera(this.myself);
    }

    isVideoOn(): boolean {
        return this.hasVideo(this.myself);
    }

    isScreenOn(): boolean {
        return this.hasScreen(this.myself);
    }

    publishMic(): void {
        debug("publishMic()")
        this.publishStream({ 'audio': true, 'video': false }, StreamType.MIC);
    }

    unpublishMic(): void {
        debug("unpublishMic()")
        this.unpublishStream(StreamType.MIC);
    }

    publishCamera(): void {
        debug("publishCamera()")
        this.publishStream({ 'audio': false, 'video': true }, StreamType.CAM);
    }

    unpublishCamera(): void {
        debug("unpublishCamera()")
        this.unpublishStream(StreamType.CAM);
    }

    publishVideo(): void {
        debug("publishVideo()")
        this.publishStream({ 'audio': true, 'video': true }, StreamType.VIDEO);
    }

    unpublishVideo(): void {
        debug("unpublishVideo()")
        this.unpublishStream(StreamType.VIDEO);
    }

    publishScreen(): void {
        debug('publishScreen()')

        if (!!chrome) {
            this.publishScreenChrome()
            return
        }

        alert("No support for screen sharing or not yet implemented");
    }

    publishScreenChrome(): void {
        debug('publishScreenChrome')
        let that = this;
        let chromeExtensionId = 'fnjgkjfmdimmbiflbodjcffjkianmcbg';
        chrome.runtime.sendMessage(chromeExtensionId, { getStream: true }, function (response) {
            if (!response) {
                debug("Access to screen denied");
                alert("Access to screen denied");
                return;
            }

            let options = {
                audio: false,
                video: {
                    mandatory: {
                        maxWidth: 1920,
                        maxHeight: 1080,
                        maxFrameRate: 30,
                        minFrameRate: 15,
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: response.streamId
                    }
                }
            };

            that.publishStream(options, StreamType.SCREEN);
        });
    }

    unpublishScreen(): void {
        debug("unpublishScreen()")
        this.unpublishStream(StreamType.SCREEN)
    }

    private publishStream(mediaConstraints: Object, streamType: string): void {
        this.session.publish({ mediaConstraints: mediaConstraints, type: streamType })
            .catch((error) => alert(`error while trying to get ${streamType} stream: ${error.message}`));
    }

    private unpublishStream(streamType: string): void {
        let stream: Stream = this.streams[this.myself.endpoint][streamType];
        this.session.unpublish(stream);
    }

    get participantArray() {
        var retval = [];
        Object.keys(this.participants).forEach((key, index) => {
            retval.push(this.participants[key]);
        })

        return retval;
    }

    cameraId(endpoint: Endpoint): string {
        return `${endpoint.endpoint}-${StreamType.CAM}`;
    }

    videoId(endpoint: Endpoint): string {
        return `${endpoint.endpoint}-${StreamType.VIDEO}`;
    }

    screenId(endpoint: Endpoint): string {
        return `${endpoint.endpoint}-${StreamType.SCREEN}`;
    }

    microphoneId(endpoint: Endpoint): string {
        return `${endpoint.endpoint}-${StreamType.MIC}`;
    }

    private unpublishStreams() {
        if (this.isMicOn()) {
            this.unpublishMic();
        }

        if (this.isCameraOn()) {
            this.unpublishCamera();
        }

        if (this.isScreenOn()) {
            this.unpublishScreen();
        }
    }

    private closeStreams() {
        if (this.isMicOn()) {
            this.closeStream(StreamType.MIC);
        }

        if (this.isCameraOn()) {
            this.closeStream(StreamType.CAM);
        }

        if (this.isScreenOn()) {
            this.closeStream(StreamType.SCREEN);
        }
    }

    private closeStream(streamType: string): void {
        let stream = this.streams[this.myself.endpoint][streamType] as Stream;
        rtcninja.closeMediaStream(stream.mediaStream);
        delete this.streams[this.myself.endpoint][streamType];
    }

    // recording functions
    record(): void {
        debug("record()");

        if (!this.recording) {
            this.recorderService.record(this.conference.name)
                .then(() => this.recording = true)
                .catch((error) => {
                    alert("Recording failed to start!")
                    console.error("Recording failed to start!", error);
                })
        }
    }

    stopRecording(): void {
        debug("stopRecording()");

        if (this.recording) {
            this.recorderService.stop(this.conference.name)
                .then(() => this.recording = false)
                .catch((error) => {
                    alert("Stop Recording failed!")
                    console.error("Stop recording failed", error);
                });
        }
    }

    askToPlay(elem: any) {
        this.elemArray.push(elem);
    }

    playElems() {
        this.elemArray.forEach(elem => elem.play());
        this.elemArray = [];
    }

    play(elem: HTMLMediaElement) {
        let promise = elem.play() as any;
        if (promise) {
            promise.catch(error => this.askToPlay(elem));
        }
    }

}
