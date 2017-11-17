import { BaseConferenceSessionState } from "./BaseConferenceSessionState";
export declare class TerminatedConferenceSessionState extends BaseConferenceSessionState {
    state: string;
    setupRules(when: Function): void;
}
