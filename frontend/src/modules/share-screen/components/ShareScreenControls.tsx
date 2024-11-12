import {memo} from "react";
import {Flex} from "antd";
import {StartShareScreenButton} from "./StartShareScreenButton.tsx";

const ShareScreenControls = memo(() => {
  return (
    <Flex>
      <StartShareScreenButton/>
    </Flex>
  )
})
ShareScreenControls.displayName = "ShareScreenControls";

export {
  ShareScreenControls
}