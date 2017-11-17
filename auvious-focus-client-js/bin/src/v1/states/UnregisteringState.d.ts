import { BaseAuviousState } from "./BaseAuviousState";
export declare class UnregisteringState extends BaseAuviousState {
    readonly state: string;
    resolve: Function;
    reject: Function;
    setupRules(when: Function): void;
}
