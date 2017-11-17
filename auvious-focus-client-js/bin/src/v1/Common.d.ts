export declare const STREAM_ID_HEADER: string;
export declare const STREAM_TYPE_HEADER: string;
export declare const CONFERENCE_MODE_HEADER: string;
export declare const CONFERENCE_ID_HEADER: string;
export declare const P2P_STREAM_ID_HEADER: string;
export declare const ICE_EXCHANGE_HEADER: string;
export declare const DOMAIN: string;
export declare const CONFERENCE_DOMAIN: string;
export declare const STREAM_DOMAIN: string;
export declare const CONFERENCE_FACTORY: string;
export declare const SESSION_ID_HEADER: string;
export declare const AUVIOUS_CONFERENCE_CLIENT_VERSION: string;
export declare const AUVIOUS_CONFERENCE_CLIENT_HEADER: string;
export declare function sipURI(username: string): string;
export declare function conferenceSipURI(conferenceId: string): string;
export declare function conferenceFactorySipURI(): string;
export declare function uriToEndpoint(uri: any): string;
export declare function getCrossBrowserRtcOfferConstraints(rtcOfferOptions: RTCOfferOptions): RTCOfferOptions | {
    mandatory: {
        OfferToReceiveAudio: boolean;
        OfferToReceiveVideo: boolean;
    };
};
export declare function getCrossBrowserRtcAnswerConstraints(rtcAnswerOptions: RTCOfferOptions): RTCOfferOptions | {
    mandatory: {
        OfferToReceiveAudio: boolean;
        OfferToReceiveVideo: boolean;
    };
};
import _xml2js = require('xml2js');
import _uuid = require('uuid');
export declare const xml2js: typeof _xml2js;
export declare const uuid: _uuid.UuidStatic;
export declare function isUsingTemasysPlugin2(): boolean;
export declare function getTemasysGetUserMedia(): Function;
