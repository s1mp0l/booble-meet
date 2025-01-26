import {MOBILE_MAX_WIDTH, MOBILE_REGEX} from '../model/constants.ts';

export const isMobileByUserAgent = (): boolean => {
  return MOBILE_REGEX.test(navigator.userAgent);
};

export const isMobileByWidth = (): boolean => {
  return window.innerWidth <= MOBILE_MAX_WIDTH;
};

export const isMobileDevice = (): boolean => {
  return isMobileByUserAgent() || isMobileByWidth();
}; 