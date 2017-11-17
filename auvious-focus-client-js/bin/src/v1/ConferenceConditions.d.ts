import { Condition } from './Condition';
export declare function anyCreateConferenceSessionEvent(): Condition;
export declare function createConferenceSessionEvent(eventId: string): Condition;
export declare function createConferenceSessionRedirected(value: boolean): Condition;
export declare function anyJoinConferenceSessionEvent(): Condition;
export declare function joinConferenceSessionEvent(eventId: string): Condition;
export declare function joinConferenceSessionOriginator(originator: string): Condition;
export declare function notified(): Condition;
export declare function notifiedForTheFirstTime(): Condition;
export declare function anyPublishStreamSessionEvent(): Condition;
export declare function anyViewStreamSessionEvent(): Condition;
export declare function anyConferenceXmlEvent(): Condition;
export declare function conferenceXmlEndpointEvent(eventId: string): Condition;
export declare function conferenceXmlStreamEvent(eventId: string): Condition;
export declare function conferenceXmlStreamEventIsNotMe(): Condition;
export declare function conferenceXmlEndpointEventIsNotMe(): Condition;
export declare function publishStreamSessionEvent(eventId: string): Condition;
export declare function viewStreamSessionEvent(eventId: string): Condition;
export declare function anyP2PStreamSessionEvent(): Condition;
export declare function p2pStreamSessionEvent(eventId: string): Condition;
