import { Event } from './Event';
import { Condition } from './Condition';
import { Action } from './Action';
export declare class Rule {
    private actions;
    private condition;
    constructor(condition: Condition);
    then(action: Action): Rule;
    and(action: Action): Rule;
    process(event: Event): void;
}
