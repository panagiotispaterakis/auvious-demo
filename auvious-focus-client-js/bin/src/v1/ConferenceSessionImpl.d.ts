import { Conference, ConferenceSession, ConferenceSessionEventHandlers, Stream, PublishOptions, Endpoint } from './AuviousApi';
import { ConferenceSessionImplFsm } from './ConferenceSessionImplFsm';
import { AuviousStateContainer } from './AuviousStateContainer';
import { Promise } from 'es6-promise';
export declare class ConferenceSessionImpl implements ConferenceSession {
    id: string;
    session: any;
    subscription: any;
    stateContainer: AuviousStateContainer;
    eventHandlers: ConferenceSessionEventHandlers;
    notifications: number;
    conference: Conference;
    conferenceInfo: Object;
    streams: Object;
    remoteEndpointData: Endpoint;
    fsm: ConferenceSessionImplFsm;
    constructor(session: any, stateContainer: AuviousStateContainer, eventHandlers?: ConferenceSessionEventHandlers);
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
