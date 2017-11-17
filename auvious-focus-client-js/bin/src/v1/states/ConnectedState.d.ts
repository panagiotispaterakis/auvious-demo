import { BaseAuviousState } from './BaseAuviousState';
import { CallOptions, CreateConferenceOptions, Conference, JoinConferenceOptions, ConferenceSession } from '../AuviousApi';
import { Promise } from 'es6-promise';
export declare class ConnectedState extends BaseAuviousState {
    readonly state: string;
    setupRules(when: Function): void;
    disconnect(): Promise<void>;
    connected(): boolean;
    call(username: string, options?: CallOptions): void;
    createConference(options: CreateConferenceOptions): Promise<Conference>;
    joinConference(options: JoinConferenceOptions): Promise<ConferenceSession>;
    message(username: string, message: string): Promise<void>;
}
