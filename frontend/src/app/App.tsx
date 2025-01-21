import './App.css'
import './Variables.css'
import {Provider} from 'react-redux';
import {store} from "../store";
import {ConfigProvider, Flex} from "antd";
import Layout, {Content, Header} from "antd/lib/layout/layout";
import {CommonControls} from "./CommonControls.tsx";
import { VideosLayout } from './VideosLayout.tsx';

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
              <VideosLayout />

              <CommonControls/>
            </Flex>
          </Content>
        </Layout>
      </Provider>
    </ConfigProvider>
  );
}

export default App
