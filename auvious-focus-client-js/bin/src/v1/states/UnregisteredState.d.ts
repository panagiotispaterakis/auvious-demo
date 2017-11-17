import { BaseAuviousState } from "./BaseAuviousState";
export declare class UnregisteredState extends BaseAuviousState {
    readonly state: string;
    setupRules(when: Function): void;
}
