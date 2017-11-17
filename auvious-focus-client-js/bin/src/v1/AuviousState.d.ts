import { AuviousApi, ConferenceSession, Session } from './AuviousApi';
import { Rule } from './Rule';
export declare class State {
    static CONNECTING: string;
    static CONNECTED: string;
    static DISCONNECTING: string;
    static DISCONNECTED: string;
    static REGISTERING: string;
    static REGISTERED: string;
    static UNREGISTERING: string;
    static UNREGISTERED: string;
    static UNKNOWN: string;
}
export interface StateWithRules {
    state: string;
    rules: Rule[];
    setupRules(when: Function): void;
}
export interface AuviousState extends AuviousApi, StateWithRules {
}
export declare class SessionState {
    static INITIALIZED: string;
    static IN_PROGRESS: string;
    static ESTABLISHED: string;
    static TERMINATED: string;
    static FAILED: string;
    static UNKNOWN: string;
}
export interface AuviousSessionState extends Session, StateWithRules {
}
export declare class ConferenceSessionState {
    static INITIALIZED: string;
    static IN_PROGRESS: string;
    static ESTABLISHED: string;
    static TERMINATING: string;
    static TERMINATED: string;
    static FAILED: string;
    static UNKNOWN: string;
}
export interface AuviousConferenceSessionState extends ConferenceSession, StateWithRules {
}
