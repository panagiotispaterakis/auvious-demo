import { BaseAuviousState } from "./BaseAuviousState";
export declare class RegisteringState extends BaseAuviousState {
    readonly state: string;
    resolve: Function;
    reject: Function;
    setupRules(when: Function): void;
}
