import { AuviousSessionState } from "../../AuviousState";
import { Rule } from "../../Rule";
import { SessionEventHandlers, HoldInfo, AnswerOptions, Endpoint } from "../../AuviousApi";
import { SessionImplFsm } from "../../SessionImplFsm";
import { Promise } from 'es6-promise';
export declare class BaseSessionState implements AuviousSessionState {
    fsm: SessionImplFsm;
    readonly state: string;
    rules: Rule[];
    constructor(fsm: SessionImplFsm);
    setupRules(when: Function): void;
    readonly session: any;
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
}
