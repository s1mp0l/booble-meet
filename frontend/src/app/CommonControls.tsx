import {memo} from "react";
import {Space} from "antd";
import {ShareScreenControls} from "../modules/share-screen/components/ShareScreenControls.tsx";
import {SelfVideoControls} from "../modules/webcam-video/components/SelfVideoControls.tsx";

const CommonControls = memo(() => {
  return (
    <Space>
      <SelfVideoControls/>

      <ShareScreenControls/>
    </Space>
  )
})
CommonControls.displayName = "CommonControls";

export {
  CommonControls
}