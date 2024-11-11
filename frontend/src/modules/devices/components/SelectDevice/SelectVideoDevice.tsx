import {memo} from "react";
import {SelectDeviceBase} from "./SelectDeviceBase.tsx";
import {selectActiveVideoDevice, selectVideoDevices, setActiveVideoDevice} from "../../store/slice.ts";

const SelectVideoDevice = memo(() => {
  return (
    <SelectDeviceBase
      setActiveDeviceActionCreator={setActiveVideoDevice}
      optionsSelector={selectVideoDevices}
      activeOptionSelector={selectActiveVideoDevice}
    />
  )
})
SelectVideoDevice.displayName = "SelectVideoDevice";

export {
  SelectVideoDevice
}