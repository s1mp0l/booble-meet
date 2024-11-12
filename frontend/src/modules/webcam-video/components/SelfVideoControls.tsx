import {memo} from "react";
import {SelectVideoDevice} from "../../devices/components/SelectDevice/SelectVideoDevice.tsx";
import {SelectAudioInputDevice} from "../../devices/components/SelectDevice/SelectInputAudioDevice.tsx";
import {SelectAudioOutputDevice} from "../../devices/components/SelectDevice/SelectOutputAudioDevice.tsx";
import {Space} from "antd";

const SelfVideoControls = memo(() => {
  return (
    <Space>
      <SelectVideoDevice/>
      <SelectAudioInputDevice/>
      <SelectAudioOutputDevice/>
    </Space>
  )
})
SelfVideoControls.displayName = "SelfVideoControls";

export {
  SelfVideoControls
}