import {memo} from "react";
import {SelectVideoDevice} from "../../devices/components/SelectDevice/SelectVideoDevice.tsx";
import {SelectAudioInputDevice} from "../../devices/components/SelectDevice/SelectInputAudioDevice.tsx";
import {SelectAudioOutputDevice} from "../../devices/components/SelectDevice/SelectOutputAudioDevice.tsx";
import {Flex} from "antd";

const SelfVideoControls = memo(() => {
  return (
    <Flex wrap align={"center"} gap={"10px"}>
      <SelectVideoDevice/>
      <SelectAudioInputDevice/>
      <SelectAudioOutputDevice/>
    </Flex>
  )
})
SelfVideoControls.displayName = "SelfVideoControls";

export {
  SelfVideoControls
}