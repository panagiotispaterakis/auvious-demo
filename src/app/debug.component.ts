import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { isUsingTemasysPlugin2, attachMediaStream2 } from './utils';

@Component({
  selector: 'debug',
  templateUrl: './debug.component.html'
})
export class DebugComponent {
  title = 'Debug Component';

  sendConstraints = {
    'audio': false,
    'video': true
  };

  receiveConstraints = {
    'audio': false,
    'video': true
  };

  localStream: any
  remoteStream: any
  pc: any

  offer: string = "";
  answer: string = "";
  candidates: string[] = [];

  constructor(private router: Router, private ngZone: NgZone) { }

  initWebRTC() {
    if (!!navigator.getUserMedia || !!navigator.mediaDevices.getUserMedia) {
      console.debug('webrtc detected')
      return
    }

    console.error('no webrtc detected');
  }

  getUserMedia() {
    console.debug('getUserMedia()');

    navigator.mediaDevices.getUserMedia(this.sendConstraints)
      .then(stream => {
        this.ngZone.run(() => {
          this.localStream = stream
          let videoElement = document.getElementById('localVideo') as HTMLVideoElement;
          if (!!videoElement) {
            if (isUsingTemasysPlugin2()) {
              attachMediaStream2(videoElement, stream);
            } else {
              videoElement.srcObject = this.localStream;
            }
          }
        });
      })
      .catch(error => console.error("getUserMedia failed", error));
  }

  createPeerConnection() {
    console.debug('createPeerConnection()')
    let that = this

    let pcConfig = {
      'iceServers': [
        {
          "urls": ["stun:148.251.144.85:443"]
        },
        {
          "urls": ["turn:148.251.144.85:443?transport=udp"],
          "username": "username",
          "credential": "password"
        },
        {
          "urls": ["turn:148.251.144.85:443?transport=tcp"],
          "username": "username",
          "credential": "password"
        }
      ]
    };

    this.pc = new RTCPeerConnection(pcConfig)
    this.pc.onicecandidate = (event) => {
      this.ngZone.run(() => {
        console.debug('onicecandidate event: ', event)
        if (!!event.candidate) {
          let candidate = {
            candidate: event.candidate.candidate,
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex
          };

          let candidateString = JSON.stringify(candidate);
          console.debug('onicecandidate candidate: ', candidateString);
          this.candidates.push(candidateString);
        }
      });

    };

    this.pc.onaddstream = (event) => {
      this.ngZone.run(() => {

        console.debug('onaddstream event: ', event)

        that.remoteStream = event.stream

        let videoElement = document.getElementById('remoteVideo') as HTMLVideoElement;
        if (!!videoElement) {
          if (isUsingTemasysPlugin2()) {
            attachMediaStream2(videoElement, event.stream);
          } else {
            videoElement.srcObject = this.remoteStream;
          }
        }
      });

    };

    this.pc.onremovestream = (event, stream) => {
      console.debug('onremovestream event: ', event)
      console.debug('onremovestream stream: ', stream)
    };
  }

  addLocalStream() {
    console.debug('addLocalStream()')
    this.pc.addStream(this.localStream)
  }

  addDataChannel(name: string) {
    console.debug('addDataChannel')
    this.pc.createDataChannel(name);
  }

  createOffer() {
    console.debug('createOffer()')

    let offerConstraints = {
      offerToReceiveAudio: this.receiveConstraints.audio ? 1 : 0,
      offerToReceiveVideo: this.receiveConstraints.video ? 1 : 0,
    } as any;

    console.debug("createOffer constraints: " + JSON.stringify(offerConstraints));

    if (!!RTCPeerConnection.prototype['addTransceiver']) {
      if (this.receiveConstraints.audio) {
        offerConstraints.offerToReceiveAudio = true;
      }

      if (this.receiveConstraints.video) {
        offerConstraints.offerToReceiveVideo = true;
      }
    }

    var createOffer = (offerConstraints) => {
      return this.pc.createOffer(offerConstraints);
    }

    if (isUsingTemasysPlugin2()) {
      createOffer = (offerConstraints) => {
        return new Promise((resolve, reject) => {
          this.pc.createOffer((desc) => resolve(desc), (error) => reject(error), offerConstraints);
        });
      };
    }

    createOffer(offerConstraints)
      .then((desc) => {
        this.ngZone.run(() => {
          console.debug('createOffer: ', JSON.stringify(desc));
          this.offer = JSON.stringify(desc);
          this.pc.setLocalDescription(desc);
        });
      })
      .catch((error) => console.error('createOffer error: ', error));
  }

  setRemoteDescription(remoteDescString: string) {
    console.debug('setRemoteDescription()', remoteDescString)

    let parsedRemoteDesc = JSON.parse(remoteDescString)
    let remoteDesc = new RTCSessionDescription(parsedRemoteDesc)
    this.pc.setRemoteDescription(remoteDesc)
  }

  createAnswer() {
    console.debug('createAnswer()')

    this.pc.createAnswer((desc) => {
      this.ngZone.run(() => {

        let answerString = JSON.stringify(desc);
        console.debug('createAnswer: ', answerString);
        this.answer = answerString;
        this.pc.setLocalDescription(desc)

      });

    }, (error) => {
      console.error('createAnswer error: ', error)
    })
  }

  addCandidate(candidate: string) {
    console.debug('addCandidate()', candidate)

    let parsedCandidate = JSON.parse(candidate)
    let iceCandidate = new RTCIceCandidate(parsedCandidate)
    this.pc.addIceCandidate(iceCandidate)
  }

  closeLocalStream() {
    let videoElement = document.getElementById('localVideo') as HTMLVideoElement;
    if (isUsingTemasysPlugin2()) {
      attachMediaStream2(videoElement, null);
    } else {
      videoElement.srcObject = null;
    }
    this.closeMediaStream(this.localStream);
    this.localStream = null;
  }

  private closeMediaStream(stream: any) {
    if (!stream) {
      return;
    }

    // Latest spec states that MediaStream has no stop() method and instead must
    // call stop() on every MediaStreamTrack.
    try {
      var tracks, i, len;

      if (stream.getTracks) {
        tracks = stream.getTracks();
        for (i = 0, len = tracks.length; i < len; i += 1) {
          tracks[i].stop();
        }
      } else {
        tracks = stream.getAudioTracks();
        for (i = 0, len = tracks.length; i < len; i += 1) {
          tracks[i].stop();
        }
        tracks = stream.getVideoTracks();
        for (i = 0, len = tracks.length; i < len; i += 1) {
          tracks[i].stop();
        }
      }
    } catch (error) {
      // Deprecated by the spec, but still in use.
      // NOTE: In Temasys IE plugin stream.stop is a callable 'object'.
      if (typeof stream.stop === 'function' || typeof stream.stop === 'object') {
        stream.stop();
      }
    }
  };
}