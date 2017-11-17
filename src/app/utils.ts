import { debug as factory } from 'debug';
import * as rtc_ninja from 'rtcninja';

rtc_ninja();

declare var isEdge;

if (typeof isEdge !== 'undefined' && isEdge) {
    factory.useColors = () => false;
}

export var debug = factory("auvious:demo");
export var rtcninja = rtc_ninja;

declare var isUsingTemasysPlugin, attachMediaStream;

export function isUsingTemasysPlugin2(): boolean {
    return (typeof isUsingTemasysPlugin !== 'undefined') && isUsingTemasysPlugin;
}

export function attachMediaStream2(element, stream): void {
    return attachMediaStream(element, stream);
}