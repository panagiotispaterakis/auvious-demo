import { Event } from './Event';
export interface Action {
    run(event: Event): void;
}
