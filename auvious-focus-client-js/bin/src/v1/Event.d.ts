import { AuviousStateContainer } from './AuviousStateContainer';
import { Session, Endpoint } from './AuviousApi';
import { ConferenceSessionImpl } from './ConferenceSessionImpl';
import { StreamImpl } from './StreamImpl';
export interface Event {
    type(): string;
    data(): any;
    extra: any;
}
export declare class UAEvent implements Event {
    eventId: string;
    eventData: any;
    stateContainer: AuviousStateContainer;
    extra: any;
    constructor(eventId: string, eventData: any, stateContainer: AuviousStateContainer);
    type(): string;
    data(): any;
}
export declare class SessionEvent implements Event {
    eventId: string;
    eventData: any;
    eventSession: Session;
    stateContainer: AuviousStateContainer;
    extra: any;
    constructor(eventId: string, eventData: any, eventSession: Session, stateContainer: AuviousStateContainer);
    type(): string;
    data(): any;
}
export declare class ApiEvent implements Event {
    eventId: string;
    apidata: any;
    extra: any;
    constructor(eventId: string, apidata: any);
    type(): string;
    data(): any;
}
export declare class SessionApiEvent implements Event {
    eventId: string;
    session: Session;
    sessionApiData: any;
    extra: any;
    constructor(eventId: string, session: Session, sessionApiData: any);
    type(): string;
    data(): any;
}
export declare class CreateConferenceSessionEvent implements Event {
    eventId: string;
    eventData: any;
    session: any;
    resolve: Function;
    reject: Function;
    stateContainer: AuviousStateContainer;
    extra: any;
    constructor(eventId: string, eventData: any, session: any, resolve: Function, reject: Function, stateContainer: AuviousStateContainer);
    type(): string;
    data(): any;
}
export declare class JoinConferenceSessionEvent implements Event {
    eventId: string;
    eventData: any;
    session: ConferenceSessionImpl;
    resolve: Function;
    reject: Function;
    stateContainer: AuviousStateContainer;
    extra: any;
    constructor(eventId: string, eventData: any, session: ConferenceSessionImpl, resolve: Function, reject: Function, stateContainer: AuviousStateContainer);
    type(): string;
    data(): any;
}
export declare class NotifyEvent implements Event {
    eventId: string;
    eventData: any;
    session: ConferenceSessionImpl;
    resolve: Function;
    reject: Function;
    extra: any;
    constructor(eventId: string, eventData: any, session: ConferenceSessionImpl, resolve: Function, reject: Function);
    type(): string;
    data(): any;
}
export declare class PublishStreamSessionEvent implements Event {
    eventId: string;
    eventData: any;
    session: ConferenceSessionImpl;
    stream: StreamImpl;
    resolve: Function;
    reject: Function;
    extra: any;
    constructor(eventId: string, eventData: any, session: ConferenceSessionImpl, stream: StreamImpl, resolve: Function, reject: Function);
    type(): string;
    data(): any;
}
export declare class ViewStreamSessionEvent implements Event {
    eventId: string;
    eventData: any;
    session: ConferenceSessionImpl;
    stream: StreamImpl;
    extra: any;
    constructor(eventId: string, eventData: any, session: ConferenceSessionImpl, stream: StreamImpl);
    type(): string;
    data(): any;
}
export declare class ConferenceXmlEndpointEvent implements Event {
    eventId: string;
    endpoint: Endpoint;
    session: ConferenceSessionImpl;
    extra: any;
    constructor(eventId: string, endpoint: Endpoint, session: ConferenceSessionImpl);
    type(): string;
    data(): any;
}
export declare class ConferenceXmlStreamEvent implements Event {
    eventId: string;
    stream: StreamImpl;
    session: ConferenceSessionImpl;
    extra: any;
    constructor(eventId: string, stream: StreamImpl, session: ConferenceSessionImpl);
    type(): string;
    data(): any;
}
export declare class P2PStreamSessionEvent implements Event {
    eventId: string;
    eventData: any;
    session: ConferenceSessionImpl;
    stream: StreamImpl;
    endpoint: string;
    extra: any;
    constructor(eventId: string, eventData: any, session: ConferenceSessionImpl, stream: StreamImpl, endpoint: string);
    type(): string;
    data(): any;
}
