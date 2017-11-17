import { Session, AnswerOptions, HoldInfo, SessionEventHandlers, Endpoint, Stream } from './AuviousApi';
import { SessionImplFsm } from "./SessionImplFsm";
import { Promise } from 'es6-promise';
export declare class SessionImpl implements Session {
    id: string;
    session: any;
    eventHandlers: SessionEventHandlers;
    remoteEndpointData: Endpoint;
    localStream: Stream;
    remoteStream: Stream;
    fsm: SessionImplFsm;
    constructor(session: any, eventHandlers?: SessionEventHandlers);
    readonly direction: string;
    readonly remoteEndpoint: Endpoint;
    isInProgress(): boolean;
    isEstablished(): boolean;
    isOnHold(): HoldInfo;
    hold(): Promise<void>;
    unhold(): Promise<void>;
    answer(options?: AnswerOptions): void;
    terminate(): void;
    on(eventId: string, handler: Function): void;
}
