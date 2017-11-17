import { BaseSessionState } from "./BaseSessionState";
import { Promise } from 'es6-promise';
export declare class EstablishedSessionState extends BaseSessionState {
    readonly state: string;
    setupRules(when: Function): void;
    hold(): Promise<void>;
    unhold(): Promise<void>;
    terminate(): void;
}
