import {memo} from "react";
import {SelectDeviceBase} from "./SelectDeviceBase.tsx";
import {selectActiveAudioInputDevice, selectAudioInputDevices, setActiveAudioInputDevice} from "../../store/slice.ts";

const SelectAudioInputDevice = memo(() => {
  return (
    <SelectDeviceBase
      setActiveDeviceActionCreator={setActiveAudioInputDevice}
      optionsSelector={selectAudioInputDevices}
      activeOptionSelector={selectActiveAudioInputDevice}
    />
  )
})
SelectAudioInputDevice.displayName = "SelectAudioInputDevice";

export {
  SelectAudioInputDevice
}