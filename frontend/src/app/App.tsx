import './App.css'
import {Provider} from 'react-redux';
import {store} from "../store";
import {SelfVideo} from "../modules/self-video/components/SelfVideo.tsx";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <SelfVideo/>
      </div>
    </Provider>
  );
}

export default App
