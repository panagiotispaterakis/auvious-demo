import { ConferenceSession, Conference, ConferenceSessionEventHandlers, PublishOptions, Stream, Endpoint } from "./AuviousApi";
import { EventHandler } from "./EventHandler";
import { Event } from "./Event";
import { ConferenceSessionImpl } from "./ConferenceSessionImpl";
import { AuviousConferenceSessionState } from "./AuviousState";
import { Promise } from 'es6-promise';
export declare class ConferenceSessionImplFsm implements ConferenceSession, EventHandler {
    conferenceSession: ConferenceSessionImpl;
    state: AuviousConferenceSessionState;
    states: AuviousConferenceSessionState[];
    constructor(conferenceSession: ConferenceSessionImpl);
    readonly id: string;
    readonly conference: Conference;
    readonly eventHandlers: ConferenceSessionEventHandlers;
    readonly direction: string;
    readonly remoteEndpoint: Endpoint;
    isInProgress(): boolean;
    isEstablished(): boolean;
    publish(options: PublishOptions): Promise<Stream>;
    unpublish(stream: Stream): void;
    leave(): void;
    terminate(): void;
    on(eventId: string, handler: Function): void;
    handle(event: Event): void;
    getState(state: string): AuviousConferenceSessionState;
    switchState(state: string): void;
}
