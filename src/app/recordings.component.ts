import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { debug } from './utils';
import { SipService } from './sip.service';

import { Auvious } from 'auvious-focus-client-js';

@Component({
    selector: 'recordings',
    templateUrl: './recordings.component.html'
})
export class RecordingsComponent {
    title = 'Recordings Component';
    sipService: Auvious;

    constructor(
        private router: Router,
        private sipServiceContainer: SipService) {
        this.sipService = sipServiceContainer.client;
    }

    ngOnInit() {
        debug("recordings ngOnInit");
        if (!this.sipService.registered() && !this.sipService.connected()) {
            this.router.navigate(['/register']);
            return;
        }
    }

    returnToPhone(): void {
        this.router.navigate(['/phone']);
    }
}
