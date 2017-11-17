import { Injectable } from '@angular/core'

import { Conference } from 'auvious-focus-client-js'

import { debug } from './utils';

@Injectable()
export class StateService {
    conferences: any;

    constructor() {
        debug("StateService constructor");
        this.conferences = {};
    }
}
