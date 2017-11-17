import { ConnectOptions, RegisterOptions } from '../AuviousApi';
import { BaseAuviousState } from "./BaseAuviousState";
import { Promise } from 'es6-promise';
export declare class DisconnectedState extends BaseAuviousState {
    readonly state: string;
    setupRules(when: Function): void;
    connect(options: ConnectOptions): Promise<void>;
    register(options: RegisterOptions): Promise<void>;
}
