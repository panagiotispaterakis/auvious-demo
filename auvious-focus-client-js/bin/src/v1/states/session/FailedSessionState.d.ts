import { BaseSessionState } from "./BaseSessionState";
export declare class FailedSessionState extends BaseSessionState {
    readonly state: string;
    setupRules(when: Function): void;
}
