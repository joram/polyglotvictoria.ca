import 'semantic-ui-css/semantic.min.css'
import './App.css';
import {BrowserRouter} from "react-router-dom";
import {Route, Routes} from "react-router";
import React from "react";
import Topics from "./components/topics";
import ProposeTopic from "./components/propose_topic";
import About from "./components/about";
import Home from "./components/home";
import Authenticate from "./components/authenticate";
import Logout from "./components/logout";

function App() {
  return <div>
      <BrowserRouter>
          <Routes>
              <Route path="/authenticate" element={<Authenticate/>}/>
              <Route path="/topic/propose" element={<ProposeTopic/>} />
              <Route path="/topics" element={<Topics/>} />
              <Route path="/about" element={<About/>} />
              <Route path="/logout" element={<Logout/>} />
              {/*<Route path="/topic/:topicId" element={<Topic/>} />*/}
              <Route path="/" element={<Home/>} />
          </Routes>
      </BrowserRouter>
  </div>
}

export default App;
