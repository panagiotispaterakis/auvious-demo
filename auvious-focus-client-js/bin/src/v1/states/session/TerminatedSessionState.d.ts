import { BaseSessionState } from "./BaseSessionState";
export declare class TerminatedSessionState extends BaseSessionState {
    readonly state: string;
    setupRules(when: Function): void;
}
