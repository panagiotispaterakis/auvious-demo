import { BaseConferenceSessionState } from "./BaseConferenceSessionState";
export declare class TerminatingConferenceSessionState extends BaseConferenceSessionState {
    state: string;
    setupRules(when: Function): void;
}
