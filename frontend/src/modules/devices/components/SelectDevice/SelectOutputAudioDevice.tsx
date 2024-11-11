import {memo} from "react";
import {SelectDeviceBase} from "./SelectDeviceBase.tsx";
import {
  selectActiveAudioOutputDevice,
  selectAudioOutputDevices,
  setActiveAudioOutputDevice
} from "../../store/slice.ts";

const SelectAudioOutputDevice = memo(() => {
  return (
    <SelectDeviceBase
      setActiveDeviceActionCreator={setActiveAudioOutputDevice}
      optionsSelector={selectAudioOutputDevices}
      activeOptionSelector={selectActiveAudioOutputDevice}
    />
  )
})
SelectAudioOutputDevice.displayName = "SelectAudioOutputDevice";

export {
  SelectAudioOutputDevice
}