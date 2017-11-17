import { Stream, Endpoint } from './AuviousApi';
export declare class StreamImpl implements Stream {
    id: string;
    type: string;
    originator: Endpoint;
    mediaStream?: MediaStream;
    session?: any;
    p2pSessions?: any;
    sipUrl?: any;
    constructor(id: string, type: string, originator: Endpoint);
    terminate(): void;
}
