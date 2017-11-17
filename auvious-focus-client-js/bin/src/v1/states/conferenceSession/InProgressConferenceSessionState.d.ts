import { BaseConferenceSessionState } from "./BaseConferenceSessionState";
export declare class InProgressConferenceSessionState extends BaseConferenceSessionState {
    state: string;
    setupRules(when: Function): void;
}
