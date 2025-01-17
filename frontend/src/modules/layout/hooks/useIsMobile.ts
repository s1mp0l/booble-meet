import {useMemo} from 'react';
import {isMobileByUserAgent} from '../utils/isMobile.ts';
import {useWindowSize} from './useWindowSize.ts';
import {MOBILE_MAX_WIDTH} from '../model/constants.ts';

export const useIsMobile = (): boolean => {
  const {width} = useWindowSize();
  
  return useMemo(() => {
    return isMobileByUserAgent() || width <= MOBILE_MAX_WIDTH;
  }, [width]);
}; 