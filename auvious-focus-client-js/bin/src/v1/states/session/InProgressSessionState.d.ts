import { BaseSessionState } from "./BaseSessionState";
import { AnswerOptions } from "../../AuviousApi";
export declare class InProgressSessionState extends BaseSessionState {
    readonly state: string;
    setupRules(when: Function): void;
    answer(options?: AnswerOptions): void;
    terminate(): void;
}
