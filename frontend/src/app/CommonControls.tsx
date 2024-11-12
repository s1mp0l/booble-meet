import {memo} from "react";
import {Flex, Space} from "antd";
import {ShareScreenControls} from "../modules/share-screen/components/ShareScreenControls.tsx";
import {SelfVideoControls} from "../modules/webcam-video/components/SelfVideoControls.tsx";
import {RecorderControls} from "../modules/recorder/components/RecorderControls.tsx";

const CommonControls = memo(() => {
  return (
    <Flex vertical gap={8} align={"center"}>
      <SelfVideoControls/>

      <Space>
        <ShareScreenControls/>

        <RecorderControls/>
      </Space>
    </Flex>
  )
})
CommonControls.displayName = "CommonControls";

export {
  CommonControls
}