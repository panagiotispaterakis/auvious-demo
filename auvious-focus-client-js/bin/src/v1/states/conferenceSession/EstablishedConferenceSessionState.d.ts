import { BaseConferenceSessionState } from "./BaseConferenceSessionState";
import { PublishOptions, Stream } from "../../AuviousApi";
import { Promise } from 'es6-promise';
export declare class EstablishedConferenceSessionState extends BaseConferenceSessionState {
    state: string;
    setupRules(when: Function): void;
    publish(options: PublishOptions): Promise<Stream>;
    unpublish(stream: Stream): void;
    leave(): void;
    terminate(): void;
}
