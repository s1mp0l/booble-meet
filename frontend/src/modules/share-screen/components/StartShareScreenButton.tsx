import {memo, useCallback} from "react";
import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import {getSelfSharedScreen} from "../utils/getSelfSharedScreen.ts";
import {selectSelfSharedScreenStream, setSharedScreen} from "../store/slice.ts";
import {Button} from "antd";

const StartShareScreenButton = memo(() => {
  const dispatch = useAppDispatch();

  const onStreamInactiveHandler = useCallback(() => {
    dispatch(setSharedScreen(null));
  }, [dispatch]);

  const streamFromStore = useAppSelector(selectSelfSharedScreenStream);

  const changeShare = useCallback(() => {
      if (streamFromStore) {
        dispatch(setSharedScreen(null));
      } else {
        (async () => {
          const mediaStream = await getSelfSharedScreen();

          if (mediaStream) {
            // @ts-expect-error This property is supported in most browsers
            mediaStream.oninactive = onStreamInactiveHandler;

            dispatch(setSharedScreen(mediaStream));
          }
        })()
      }
    },
    [dispatch, onStreamInactiveHandler, streamFromStore]
  );
  
  return (
    <Button
      onClick={changeShare}
      type={"primary"}
      danger={!!streamFromStore}
      variant={"solid"}
    >
      {streamFromStore ? "Stop sharing" : "Share screen"}
    </Button>
  )
})
StartShareScreenButton.displayName = "StartShareScreenButton";

export {
  StartShareScreenButton
}