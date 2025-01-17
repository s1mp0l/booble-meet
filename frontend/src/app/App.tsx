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
import { VideoGrid } from '../modules/layout/components/VideoGrid.tsx';

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
              style={{height: "100%", width: "100%", padding: 16}}
              align={"center"}
              justify={"center"}
              gap={16}
            >
              <VideoGrid>
                <SelfVideo index={0}/>

                <ShareScreenVideo index={1}/>

                <RecordedVideo index={2}/>
              </VideoGrid>

              <CommonControls/>
            </Flex>
          </Content>
        </Layout>
      </Provider>
    </ConfigProvider>
  );
}

export default App
