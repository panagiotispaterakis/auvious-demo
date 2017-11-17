import { AuviousConferenceSessionState } from "../../AuviousState";
import { Conference, ConferenceSessionEventHandlers, PublishOptions, Stream, Endpoint } from "../../AuviousApi";
import { Rule } from "../../Rule";
import { ConferenceSessionImplFsm } from "../../ConferenceSessionImplFsm";
import { Promise } from 'es6-promise';
export declare class BaseConferenceSessionState implements AuviousConferenceSessionState {
    fsm: ConferenceSessionImplFsm;
    readonly state: string;
    rules: Rule[];
    constructor(fsm: ConferenceSessionImplFsm);
    setupRules(when: Function): void;
    readonly session: any;
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
}
