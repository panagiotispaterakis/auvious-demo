import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { SipService } from './sip.service';
import { Auvious, RegisterOptions, UAEventHandlers, ConnectOptions } from 'auvious-focus-client-js';
import { debug } from './utils';

@Component({
  selector: 'register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  title = 'Register Component';

  username: string;
  password: string;
  jwt: string;
  focusUrl: string;

  connectionFailed: boolean = false;
  connectionFailedMessage: string;

  registrationFailed: boolean = false;
  registrationFailedMessage: string;

  warning: boolean = false;
  warningMessage: string;

  sipService: Auvious;

  constructor(private sipServiceContainer: SipService, private router: Router, private ngZone: NgZone) {
    this.sipService = sipServiceContainer.client;
  }

  ngOnInit() {
    debug("register ngOnInit");
  }

  connecting(): boolean {
    return this.sipService.connecting();
  }

  connect() {
    let eventHandlers: UAEventHandlers = {
      connected: () => this.router.navigate(['/phone']),
      connectionFailed: (e: Error) => {
        this.ngZone.run(() => {
          this.connectionFailedMessage = e.message;
          this.connectionFailed = true;
        });

        Observable.timer(10000).subscribe(() => {
          this.ngZone.run(() => {
            this.connectionFailed = false;
          })
        });
      },
      warning: (message: string) => {
        this.ngZone.run(() => {
          this.warningMessage = message;
          this.warning = true;
        });
        Observable.timer(10000).subscribe(() => {
          this.ngZone.run(() => {
            this.warning = false
          })
        });
      }
    }

    let options: ConnectOptions = {
      focusUrl: !!this.focusUrl ? this.focusUrl : this.sipServiceContainer.focusUrl,
      username: this.username,
      eventHandlers: eventHandlers
    }

    try {
      this.sipService.connect(options);
    } catch (e) {
      console.error(e);
    }
  }

  register() {
    let eventHandlers: UAEventHandlers = {
      registered: () => this.router.navigate(['/phone']),
      registrationFailed: (e: Error) => {
        this.ngZone.run(() => {
          this.registrationFailedMessage = e.message;
          this.registrationFailed = true;
        });

        Observable.timer(10000).subscribe(() => {
          this.ngZone.run(() => {
            this.registrationFailed = false
          });
        });
      },
      connectionFailed: (e: Error) => {
        this.ngZone.run(() => {
          this.connectionFailedMessage = e.message;
          this.connectionFailed = true;
        });

        Observable.timer(10000).subscribe(() => {
          this.ngZone.run(() => {
            this.connectionFailed = false;
          })
        });
      },
      warning: (message: string) => {
        this.ngZone.run(() => {
          this.warningMessage = message;
          this.warning = true;
        });

        Observable.timer(10000).subscribe(() => {
          this.ngZone.run(() => {
            this.warning = false
          })
        });
      }
    };

    let options = {
      focusUrl: !!this.focusUrl ? this.focusUrl : this.sipServiceContainer.focusUrl,
      username: this.username,
      password: this.password,
      body: this.jwt,
      contentType: this.jwt ? "application/jwt" : '',
      eventHandlers: eventHandlers
    }

    try {
      this.sipService.register(options);
    } catch (e) {
      console.error(e);
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
