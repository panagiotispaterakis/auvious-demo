import { BaseSessionState } from "./BaseSessionState";
export declare class InitializedSessionState extends BaseSessionState {
    state: string;
    setupRules(when: Function): void;
    terminate(): void;
}
