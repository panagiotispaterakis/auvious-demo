import { AuviousState } from '../AuviousState';
import { AuviousStateContainer } from '../AuviousStateContainer';
import { Rule } from '../Rule';
import { ConnectOptions, RegisterOptions, CallOptions, CreateConferenceOptions, Conference, JoinConferenceOptions, ConferenceSession } from "../AuviousApi";
import { Promise } from 'es6-promise';
export declare class BaseAuviousState implements AuviousState {
    stateContainer: AuviousStateContainer;
    rules: Rule[];
    readonly state: string;
    constructor(stateContainer: AuviousStateContainer);
    setupRules(when: Function): void;
    connect(options: ConnectOptions): Promise<void>;
    disconnect(): Promise<void>;
    register(options: RegisterOptions): Promise<void>;
    unregister(): Promise<void>;
    connecting(): boolean;
    connected(): boolean;
    registered(): boolean;
    identity(): string;
    endpoint(): string;
    call(username: string, options?: CallOptions): void;
    createConference(options: CreateConferenceOptions): Promise<Conference>;
    joinConference(options: JoinConferenceOptions): Promise<ConferenceSession>;
    message(username: string, message: string): Promise<void>;
    on(event: string, handler: Function): void;
}
