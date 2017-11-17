import { Event } from './Event';
export interface Matcher {
    matches(event: Event): boolean;
}
export declare class Condition {
    private matcher;
    private andConditions;
    private orConditions;
    constructor(matcher: Matcher);
    matches(event: Event): boolean;
    and(c: Condition): Condition;
    or(c: Condition): Condition;
}
