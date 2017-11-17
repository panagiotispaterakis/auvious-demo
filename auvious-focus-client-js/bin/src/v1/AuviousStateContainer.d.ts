import { AuviousState } from './AuviousState';
import { UAEventHandlers } from './AuviousApi';
import { Event } from './Event';
import { EventHandler } from './EventHandler';
import { ConferenceSessionImpl } from "./ConferenceSessionImpl";
import { SessionImpl } from "./SessionImpl";
export declare class AuviousStateContainer implements EventHandler {
    focusUrl: string;
    state: AuviousState;
    states: AuviousState[];
    identity: string;
    endpoint: string;
    phone: any;
    eventHandlers: UAEventHandlers;
    sessions: SessionImpl[];
    conferenceSessions: ConferenceSessionImpl[];
    constructor();
    getState(state: string): AuviousState;
    switchState(state: string): void;
    handle(event: Event): void;
}
