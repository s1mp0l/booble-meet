import {memo} from "react";
import {Flex, Space} from "antd";
import {ShareScreenControls} from "../modules/share-screen/components/ShareScreenControls.tsx";
import {SelfVideoControls} from "../modules/webcam-video/components/SelfVideoControls.tsx";
import {RecorderControls} from "../modules/recorder/components/RecorderControls.tsx";
import { useIsMobile } from "../modules/layout/hooks/useIsMobile.ts";
import { EffectsButton } from "../modules/visual-effects/components/EffectsDrawer/EffectsButton.tsx";
import { MuteButton } from "../modules/webcam-video/components/MuteButton.tsx";
import { HideVideoButton } from "../modules/webcam-video/components/HideVideoButton.tsx";

interface ICommonControlsProps {
  inConference?: boolean;
}

const CommonControls = memo<ICommonControlsProps>(({
  inConference = false
}) => {
  const isMobile = useIsMobile();

  return (
    <Flex vertical gap={8} align={"center"}>
      {isMobile ? null : <SelfVideoControls/>}

      <Space>
        <MuteButton/>
        
        <HideVideoButton/>
      
        {inConference && <ShareScreenControls/>}

        {inConference && <RecorderControls/>}

        <EffectsButton />
      </Space>
    </Flex>
  )
})
CommonControls.displayName = "CommonControls";

export {
  CommonControls
}