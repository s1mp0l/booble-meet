import {useMemo} from 'react';
import {isMobileByUserAgent, isMobileByWidth} from '../utils/isMobile.ts';

export const useIsMobile = (): boolean => {  
  return useMemo(() => {
    return isMobileByUserAgent() || isMobileByWidth();
  }, []);
}; 