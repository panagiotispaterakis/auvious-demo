import { BaseAuviousState } from "./BaseAuviousState";
export declare class DisconnectingState extends BaseAuviousState {
    readonly state: string;
    resolve: Function;
    reject: Function;
    setupRules(when: Function): void;
}
