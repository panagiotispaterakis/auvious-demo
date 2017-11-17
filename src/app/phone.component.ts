import { Component, Input, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Observable } from 'rxjs/Rx';

import { SipService } from './sip.service';
import { StateService } from './state.service';

import {
    Stream, Conference, ConferenceMode, Auvious,
    CreateConferenceOptions, CallOptions, AnswerOptions, Session,
    SessionEventHandlers
} from 'auvious-focus-client-js';

import { debug, rtcninja, isUsingTemasysPlugin2, attachMediaStream2 } from './utils';

@Component({
    selector: 'phone',
    templateUrl: './phone.component.html'
})
export class PhoneComponent implements OnInit {
    title: string = 'Phone Component';
    warning: string;

    @Input() contact: string;

    sendConstraints = {
        audio: true,
        video: true
    };

    receiveConstraints = {
        audio: true,
        video: true
    }

    messages: string[] = [];

    session: Session;

    isOnHold: boolean = false;
    ongoingCall: boolean = false;
    callFailed: boolean = false;
    callFailedMsg: string;

    remoteStream: MediaStream;
    localStream: MediaStream;

    sipService: Auvious;
    attempts: number = 0;

    elemArray: HTMLMediaElement[] = [];

    constructor(
        private sipServiceContainer: SipService,
        private stateService: StateService,
        private router: Router,
        private ngZone: NgZone,
        private sanitizer: DomSanitizer
    ) {
        this.sipService = sipServiceContainer.client
    }

    ngOnInit() {
        debug("phone ngOnInit");

        if (!this.sipService.registered() && !this.sipService.connected()) {
            this.router.navigate(['/register']);
        } else {
            this.sipService.on('newSession', (session) => this.ngZone.run(() => {
                this.setupSession(session);
            }));

            this.sipService.on('newMessage', (message) => {
                this.messages.push(`${message.sender}  said: ${message.content}`);
            });

            this.sipService.on('connecting', (data) => this.attempts = data.attempts);

            this.sipService.on('conferenceCreated', (conference: Conference) => {
                debug('conferenceCreated');
                this.stateService.conferences[conference.name] = conference;
            });

            this.sipService.on('createConferenceFailed', (error: Error) => {
                debug('createConferenceFailed', error)
                alert('Create Conference Failed!')
            });

            this.sipService.on('registrationFailed', (error) => {
                debug("registration failed: ", error);
                alert("Registration Failed!")
                this.router.navigate(['/register'])
            });

            this.sipService.on('connectionFailed', (error) => {
                debug("connection failed: ", error);
                alert("Connection Failed! Please try to login again in a few minutes!")
                this.router.navigate(['/register'])
            });

            this.sipService.on('warning', (warning) => {
                debug('warning: ', warning);

                this.ngZone.run(() => this.warning = warning);
                setTimeout(() => this.warning = null, 5000);
            });
        }
    }

    get conferences() {
        var retval = [];
        Object.keys(this.stateService.conferences).forEach((key, index) => {
            retval.push(this.stateService.conferences[key]);
        });
        return retval;
    }

    sendMessage(user: string, message: string) {
        this.sipService.message(user, message)
            .then((data) => {
                debug('send message success', data);
                this.messages.push(`You said to ${user}: ${message}`);
            })
            .catch((error) => {
                debug('send message failed: ', error)
            })
    }

    call() {
        if (!this.contact || !this.contact.length) {
            return;
        }

        let options: CallOptions = {
            mediaConstraints: {
                audio: this.sendConstraints.audio,
                video: this.sendConstraints.video
            },
            receiveMediaConstraints: {
                audio: this.receiveConstraints.audio,
                video: this.receiveConstraints.video
            },
            eventHandlers: this.getSessionEventHandlers()
        }

        try {
            this.sipService.call(this.contact, options);
        } catch (e) {
            debug("exception while calling", e);
        }
    }

    answer() {
        debug('will answer');
        if (this.incomingCall()) {
            let options: AnswerOptions = {
                mediaConstraints: {
                    audio: this.sendConstraints.audio,
                    video: this.sendConstraints.video
                },
                receiveMediaConstraints: {
                    audio: this.receiveConstraints.audio,
                    video: this.receiveConstraints.video
                },
                eventHandlers: this.getSessionEventHandlers()
            }

            this.session.answer(options);
            let elem = document.getElementById('ringing') as HTMLAudioElement;
            elem.pause();
        } else {
            window.alert('incoming call not in progress');
        }
    }

    hangup() {
        debug('will hangup');
        this.session.terminate();
    }

    logout() {
        if (this.sipService.registered()) {
            this.sipService.on('unregistered', () => this.router.navigate(['/register']));
            this.sipService.unregister();
        } else {
            this.sipService.on('disconnected', () => this.router.navigate(['/register']));
            this.sipService.disconnect();
        }
    }

    exit() {
        let that = this;
        this.sipService.unregister();
        that.router.navigate(['/register']);
    }

    outgoingCall() {
        return this.callInProgress() && this.session.direction == 'outgoing';
    }

    incomingCall() {
        return this.callInProgress() && this.session.direction == 'incoming';
    }

    callInProgress() {
        return !!this.session && !!this.session.isInProgress();
    }

    establishedCall() {
        return this.session && this.session.isEstablished();
    }

    localStreamHasMicrophone(): boolean {
        return this.localStream && this.localStream.getAudioTracks().length > 0;
    }

    localStreamHasCamera(): boolean {
        return this.localStream && this.localStream.getVideoTracks().length > 0;
    }

    remoteStreamHasMicrophone(): boolean {
        return this.remoteStream && this.remoteStream.getAudioTracks().length > 0;
    }

    remoteStreamHasCamera(): boolean {
        return this.remoteStream && this.remoteStream.getVideoTracks().length > 0;
    }

    resetStreams(): void {
        rtcninja.closeMediaStream(this.localStream);
        rtcninja.closeMediaStream(this.remoteStream);
        this.localStream = null;
        this.remoteStream = null;
    }

    // conference functions
    createConference(p2p: boolean, conferenceId: string): void {
        debug('createConference(' + p2p + ')', p2p);
        let options: CreateConferenceOptions = {
            mode: p2p ? ConferenceMode.P2P : ConferenceMode.ROUTER,
            id: conferenceId
        };

        this.sipService.createConference(options);
    }

    joinConference(conferenceId: string): void {
        this.router.navigate(['/conference', this.sipService.identity(), conferenceId])
    }

    viewRecordings(): void {
        this.router.navigate(['/recordings']);
    }

    private setupSession(session: Session) {
        this.ongoingCall = true;
        this.callFailed = false;
        this.isOnHold = false;
        this.session = session;
        session.eventHandlers = this.getSessionEventHandlers();
    }

    private getSessionEventHandlers(): SessionEventHandlers {
        return {
            accepted: () => {
                let elem = document.getElementById('remote-ringing') as HTMLAudioElement;
                elem.pause();

                this.ngZone.run(() => {
                    debug('call accepted from ' + this.session.remoteEndpoint.username);
                });
            },
            ringing: () => {
                if (this.session.direction == 'outgoing') {
                    let elem = document.getElementById('remote-ringing') as HTMLAudioElement;
                    this.play(elem);
                } else {
                    let elem = document.getElementById('ringing') as HTMLAudioElement;
                    this.play(elem);
                }

                this.ngZone.run(() => {
                    debug('session: ', this.session);
                });
            },
            streamAdded: (stream: Stream) => {
                if (stream.originator.endpoint == this.sipService.endpoint()) {
                    this.ngZone.run(() => {
                        this.localStream = stream.mediaStream;
                        let localVideoElement = document.getElementById('local-video') as HTMLVideoElement;
                        if (isUsingTemasysPlugin2()) {
                            attachMediaStream2(localVideoElement, stream.mediaStream);
                        } else {
                            localVideoElement.srcObject = stream.mediaStream;
                            localVideoElement.muted = true;
                            localVideoElement.autoplay = true;
                            this.play(localVideoElement);
                        }
                    });
                } else if (stream.originator.endpoint == this.session.remoteEndpoint.endpoint) {
                    this.ngZone.run(() => {
                        this.remoteStream = stream.mediaStream;
                        let remoteVideoElement = document.getElementById('remote-video') as HTMLVideoElement;
                        if (isUsingTemasysPlugin2()) {
                            attachMediaStream2(remoteVideoElement, stream.mediaStream);
                        } else {
                            remoteVideoElement.srcObject = stream.mediaStream;
                            remoteVideoElement.muted = false;
                            remoteVideoElement.autoplay = true;
                            this.play(remoteVideoElement);
                        }
                    });
                } else {
                    throw new Error(`unknown originator: ${stream.originator}`)
                }
            },
            streamRemoved: (stream: Stream) => {
                if (stream.originator.endpoint == this.sipService.endpoint()) {
                    this.ngZone.run(() => {
                        this.localStream = null;
                        rtcninja.closeMediaStream(stream.mediaStream);
                    });
                } else {
                    this.ngZone.run(() => {
                        this.remoteStream = null;
                        rtcninja.closeMediaStream(stream.mediaStream);
                    });
                }
            },
            ended: () => {
                this.ngZone.run(() => {
                    this.resetStreams();
                    this.ongoingCall = false;
                });
            },
            failed: (error: Error) => {
                if (this.session.direction == 'outgoing') {
                    let elem = document.getElementById('remote-ringing') as HTMLAudioElement;
                    elem.pause();
                } else {
                    let elem = document.getElementById('ringing') as HTMLAudioElement;
                    elem.pause();
                }

                this.ngZone.run(() => {

                    this.callFailedMsg = error.message;
                    this.callFailed = true;

                    this.resetStreams();
                    this.ongoingCall = false;

                    Observable.timer(10000).subscribe(t => this.callFailed = false);
                });
            }
        };
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
