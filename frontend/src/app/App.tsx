import './App.css'
import './Variables.css'
import {Provider} from 'react-redux';
import {store} from "../store";
import {ConfigProvider, Flex} from "antd";
import Layout, {Content, Header} from "antd/lib/layout/layout";
import {ShareScreenVideo} from "../modules/share-screen/components/ShareScreenVideo.tsx";
import {SelfVideo} from "../modules/webcam-video/components/SelfVideo.tsx";
import {CommonControls} from "./CommonControls.tsx";
import {RecordedVideo} from "../modules/recorder/components/RecordedVideo.tsx";
import {FaceDetectionCanvas} from "../modules/face-detection/components/FaceDetectionCanvas.tsx";

function App() {
  return (
    <ConfigProvider
      theme={{
        cssVar: true,
      }}
    >
      <Provider store={store}>
        <Layout style={{height: "100%"}}>
          <Header/>

          <Content>
            <Flex
              vertical
              style={{height: "100%", width: "100%"}}
              align={"center"}
              justify={"center"}
              gap={32}
            >
              <Flex wrap={true} gap={16} align={"center"} justify={"center"}>
                <SelfVideo/>

                <FaceDetectionCanvas/>

                {/* <ShareScreenVideo/>

                <RecordedVideo/> */}
              </Flex>

              <CommonControls/>
            </Flex>
          </Content>
        </Layout>
      </Provider>
    </ConfigProvider>
  );
}

export default App
