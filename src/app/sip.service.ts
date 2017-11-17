import { Injectable } from '@angular/core';

import { Auvious } from 'auvious-focus-client-js';

import { debug } from './utils';

@Injectable()
export class SipService {
    focusUrl: string = "wss://test-sip.auvious.com";
    client: Auvious;

    constructor() {
        debug("SipService constructor");

        let localServer = window.localStorage.getItem("sip.server.url");

        this.focusUrl = !!localServer ? localServer : this.focusUrl;

        this.client = new Auvious();
    }
}
