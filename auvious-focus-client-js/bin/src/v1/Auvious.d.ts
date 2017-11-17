import { AuviousApi, ConnectOptions, RegisterOptions, CallOptions, Conference, ConferenceSession, JoinConferenceOptions, CreateConferenceOptions } from './AuviousApi';
import { Promise } from 'es6-promise';
export declare class Auvious implements AuviousApi {
    private stateContainer;
    constructor();
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
    createConference(options?: CreateConferenceOptions): Promise<Conference>;
    joinConference(options: JoinConferenceOptions): Promise<ConferenceSession>;
    message(username: string, message: string): Promise<void>;
    on(event: string, handler: Function): void;
    private state();
}
