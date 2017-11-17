import { Condition } from './Condition';
import { State } from './AuviousState';
export declare function apiRequest(request: string): Condition;
export declare function anyEvent(): Condition;
export declare function anyApiEvent(): Condition;
export declare function anyUAEvent(): Condition;
export declare function anySessionEvent(): Condition;
export declare function uaEvent(eventId: string): Condition;
export declare function newOutgoingSession(): Condition;
export declare function newIncomingSession(): Condition;
export declare function newMessage(): Condition;
export declare function newIncomingConferenceP2PStreamSession(): Condition;
export declare function sessionEvent(eventId: string): Condition;
export declare function sessionOriginator(originator: string): Condition;
export declare function registrationFailed(): Condition;
export declare function disconnected(): Condition;
export declare function connectionFailed(): Condition;
export declare function state(state: State): Condition;
export declare function targetState(state: State): Condition;
