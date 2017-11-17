import { BaseConferenceSessionState } from "./BaseConferenceSessionState";
export declare class FailedConferenceSessionState extends BaseConferenceSessionState {
    state: string;
    setupRules(when: Function): void;
}
