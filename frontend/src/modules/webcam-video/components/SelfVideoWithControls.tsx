import {memo} from "react";
import {SelfVideoControls} from "./SelfVideoControls.tsx";
import {Flex} from "antd";
import {SelfVideo} from "./SelfVideo.tsx";

const SelfVideoWithControls = memo(() => {
  return (
    <Flex vertical gap={16} align={"center"}>
      <SelfVideo/>

      <SelfVideoControls/>
    </Flex>
  )
})
SelfVideoWithControls.displayName = "SelfVideoWithControls";

export {
  SelfVideoWithControls
}