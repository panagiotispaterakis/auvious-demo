import { Session, HoldInfo, AnswerOptions, SessionEventHandlers, Endpoint } from "./AuviousApi";
import { SessionImpl } from "./SessionImpl";
import { EventHandler } from "./EventHandler";
import { Event } from './Event';
import { AuviousSessionState } from "./AuviousState";
import { Promise } from 'es6-promise';
export declare class SessionImplFsm implements Session, EventHandler {
    session: SessionImpl;
    state: AuviousSessionState;
    states: AuviousSessionState[];
    constructor(session: SessionImpl);
    readonly id: string;
    readonly eventHandlers: SessionEventHandlers;
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
    handle(event: Event): void;
    getState(state: string): AuviousSessionState;
    switchState(state: string): void;
}
