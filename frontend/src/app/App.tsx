import './App.css'
import './Variables.css'
import {Provider} from 'react-redux';
import {store} from "../store";
import {ConfigProvider, Flex, Space, theme} from "antd";
import Layout, {Content, Header} from "antd/lib/layout/layout";
import {ShareScreenVideo} from "../modules/share-screen/components/ShareScreenVideo.tsx";
import {SelfVideo} from "../modules/webcam-video/components/SelfVideo.tsx";
import {CommonControls} from "./CommonControls.tsx";

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
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
            >
              <Space>
                <SelfVideo/>

                <ShareScreenVideo/>
              </Space>

              <CommonControls/>
            </Flex>
          </Content>
        </Layout>
      </Provider>
    </ConfigProvider>
  );
}

export default App
