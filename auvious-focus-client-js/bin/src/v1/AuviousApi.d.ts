import { Promise } from 'es6-promise';
export declare const jssip: any;
export interface UAEventHandlers {
    connecting?: Function;
    connected?: Function;
    disconnected?: Function;
    connectionFailed?: Function;
    registered?: Function;
    unregistered?: Function;
    registrationFailed?: Function;
    warning?: Function;
    newSession?: Function;
    newConferenceSession?: Function;
    conferenceCreated?: Function;
    createConferenceFailed?: Function;
    newMessage?: Function;
}
export interface SessionEventHandlers {
    connecting?: Function;
    ringing?: Function;
    accepted?: Function;
    streamAdded?: Function;
    streamRemoved?: Function;
    ended?: Function;
    failed?: Function;
}
export interface ConferenceSessionEventHandlers {
    connecting?: Function;
    accepted?: Function;
    endpointJoined?: Function;
    endpointLeft?: Function;
    streamAdded?: Function;
    streamRemoved?: Function;
    ended?: Function;
    failed?: Function;
}
export interface ConnectOptions {
    username: string;
    focusUrl?: string;
    eventHandlers?: UAEventHandlers;
}
export interface RegisterOptions {
    username: string;
    password?: string;
    focusUrl?: string;
    eventHandlers?: UAEventHandlers;
    body?: string;
    contentType?: string;
}
export interface MediaConstraints {
    audio?: boolean;
    video?: boolean;
}
export interface CallOptions {
    mediaStream?: MediaStream;
    mediaConstraints?: MediaConstraints;
    receiveMediaConstraints?: MediaConstraints;
    eventHandlers?: SessionEventHandlers;
}
export interface AnswerOptions {
    mediaStream?: MediaStream;
    mediaConstraints?: MediaConstraints;
    receiveMediaConstraints?: MediaConstraints;
    eventHandlers?: SessionEventHandlers;
}
export interface HoldInfo {
    local?: boolean;
    remote?: boolean;
}
export interface Message {
    content: string;
    contentType: string;
    sender: string;
    recipient: string;
}
export interface Session {
    id: string;
    eventHandlers: SessionEventHandlers;
    readonly direction: string;
    readonly remoteEndpoint: Endpoint;
    isInProgress(): boolean;
    isEstablished(): boolean;
    isOnHold(): HoldInfo;
    hold(): Promise<void>;
    unhold(): Promise<void>;
    answer(options?: AnswerOptions): void;
    terminate(): void;
    on(eventId: string, handler: Function): any;
}
export interface PublishOptions {
    mediaStream?: MediaStream;
    mediaConstraints?: MediaConstraints;
    type: string;
}
export interface ConferenceSession {
    id: string;
    conference: Conference;
    eventHandlers: ConferenceSessionEventHandlers;
    readonly direction: string;
    readonly remoteEndpoint: Endpoint;
    isInProgress(): boolean;
    isEstablished(): boolean;
    publish(options: PublishOptions): Promise<Stream>;
    unpublish(stream: Stream): any;
    leave(): void;
    terminate(): void;
    on(eventId: string, handler: Function): any;
}
export declare class ConferenceMode {
    static P2P: string;
    static ROUTER: string;
    static UNKNOWN: string;
}
export interface Conference {
    name: string;
    mode: string;
}
export interface CreateConferenceOptions {
    id?: string;
    mode?: string;
}
export interface JoinConferenceOptions {
    id: string;
    eventHandlers: ConferenceSessionEventHandlers;
}
export interface Endpoint {
    username: string;
    endpoint: string;
}
export declare class StreamType {
    static MIC: string;
    static CAM: string;
    static SCREEN: string;
    static VIDEO: string;
    static UNKNOWN: string;
}
export interface Stream {
    id: string;
    mediaStream?: MediaStream;
    type: string;
    originator: Endpoint;
}
export interface AuviousApi {
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
    on(event: string, handler: Function): any;
}
