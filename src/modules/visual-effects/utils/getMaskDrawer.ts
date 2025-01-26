import { createEyeMaskDrawer } from "./faceMasks/eyeMask";
import { createCoolGuyMask } from "./faceMasks/coolGuyMask";
import { createMoustacheMask } from "./faceMasks/moustacheMask";
import { FaceMaskType } from "../model/types";

export const getMaskDrawer = (maskType: FaceMaskType | 'none') => {
  if (maskType === 'none') return undefined;
    
  switch (maskType) {
    case 'eyes':
      return createEyeMaskDrawer('/assets/eye.png');
    case 'glasses':
      return createCoolGuyMask('/assets/coolGuy.png');
    case 'mustache':
      return createMoustacheMask('/assets/moustache.png');
    default:
      return undefined;
  }
}; 