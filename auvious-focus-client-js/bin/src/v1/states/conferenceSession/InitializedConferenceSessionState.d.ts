import { BaseConferenceSessionState } from "./BaseConferenceSessionState";
export declare class InitializedConferenceSessionState extends BaseConferenceSessionState {
    state: string;
    setupRules(when: Function): void;
}
