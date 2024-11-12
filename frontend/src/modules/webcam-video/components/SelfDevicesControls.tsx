import {memo} from "react";
import {Flex} from "antd";

const SelfDevicesControls = memo(() => {
  return (
    <Flex vertical>
      <SelfDevicesControls/>
    </Flex>
  )
})
SelfDevicesControls.displayName = "SelfDevicesControls";

export {
  SelfDevicesControls
}