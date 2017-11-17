import { Injectable } from '@angular/core';

import { debug } from './utils';

@Injectable()
export class RecorderService {
    recorderUrl: string = "https://test-recorder.auvious.com/recorder";
    mix: boolean = false;
    audio: boolean = false;
    video: boolean = false;

    constructor() {
        debug("SipService constructor");

        let localServer = window.localStorage.getItem("recorder.server.url");
        let localMix = window.localStorage.getItem("recorder.mix") == 'true';
        let localAudio = window.localStorage.getItem("recorder.audio") == 'true';
        let localVideo = window.localStorage.getItem("recorder.video") == 'true';

        this.recorderUrl = !!localServer ? localServer : this.recorderUrl;
        this.mix = !!localMix ? localMix : false;
        this.audio = !!localAudio ? localAudio : false;
        this.video = !!localVideo ? localVideo : false;
    }

    record(conferenceId: string): Promise<void> {
        let command = {
            command: "record",
            conferenceId: conferenceId,
            mix: this.mix,
            audio: this.audio,
            video: this.video
        };

        return this.command(command);
    }

    stop(conferenceId: string): Promise<void> {
        let command = {
            command: "stop",
            conferenceId: conferenceId
        };

        return this.command(command);
    }

    private command(command: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.open("POST", this.recorderUrl + "/commands", true);

            xhr.onload = function (e) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve()
                    } else {
                        reject(new Error(xhr.statusText));
                    }
                }
            };

            xhr.onerror = function (e) {
                reject(e);
            };

            xhr.send(JSON.stringify(command));
        });
    }
}
