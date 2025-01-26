import {memo} from "react";
import {Space} from "antd";
import {StartRecordVideoButton} from "./StartRecordVideoButton";

const RecorderControls = memo(() => {
  return (
    <Space>
      <StartRecordVideoButton/>
    </Space>
  )
})
RecorderControls.displayName = "RecorderControls";

export {
  RecorderControls
}