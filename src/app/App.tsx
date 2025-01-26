import './App.css'
import './Variables.css'
import {Provider} from 'react-redux';
import {store} from "../store";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CreateConference } from '../modules/conference/components/CreateConference';
import { JoinConference } from '../modules/conference/components/JoinConference';
import { Conference } from '../modules/conference/components/Conference';
import { ConfigProvider } from 'antd';

function App() {
  return (
    <ConfigProvider
      theme={{
        cssVar: true,
      }}
    >
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/create" replace />} />
            <Route path="/create" element={<CreateConference />} />
            <Route path="/conference/:roomId/join" element={<JoinConference />} />
            <Route path="/conference/:roomId" element={<Conference />} />
          </Routes>
        </Router>
      </Provider>
    </ConfigProvider>
  );
}

export default App
