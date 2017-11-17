import { CallOptions, CreateConferenceOptions, Conference, JoinConferenceOptions, ConferenceSession } from "../AuviousApi";
import { Promise } from 'es6-promise';
import { BaseAuviousState } from "./BaseAuviousState";
export declare class RegisteredState extends BaseAuviousState {
    readonly state: string;
    setupRules(when: Function): void;
    unregister(): Promise<void>;
    connected(): boolean;
    registered(): boolean;
    call(username: string, options?: CallOptions): void;
    createConference(options?: CreateConferenceOptions): Promise<Conference>;
    joinConference(options: JoinConferenceOptions): Promise<ConferenceSession>;
    message(username: string, message: string): Promise<void>;
}
