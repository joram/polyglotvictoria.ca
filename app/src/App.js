import 'semantic-ui-css/semantic.min.css'
import './App.css';
import LoginButton from "./components/login_button";
import {BrowserRouter, useNavigate, useSearchParams} from "react-router-dom";
import {Route, Routes} from "react-router";
import Cookies from 'universal-cookie';
import {Button, Card, Container, Form, Header, Icon, Image, TextArea} from "semantic-ui-react";
import React from "react";
import Topics from "./components/topics";
import ProposeTopic from "./components/propose_topic";

const cookies = new Cookies();

function SigninWithGithubButton(){
    return <>
        <LoginButton/>
    </>
}

function _get_github_profile_and_session_token(code, state){
    let url = "https://polyglot.oram.ca/auth/session_token?code="+code+"&state="+state
    return fetch(url).then(response => response.json()).then(data =>{
        cookies.set('session_token', data.session_token, { path: '/' });
        cookies.set('github_profile', data.github_profile, { path: '/' });
        console.log(cookies.get("session_token"))
        console.log(cookies.get("github_profile"))
        return data
    })
}

function Authenticate(){
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    let code = searchParams.get("code")
    let state = searchParams.get("state")
    _get_github_profile_and_session_token(code, state).then(data => {
        navigate("/", { replace: true });
    })
    return <>
        you are authed, and should be redirected shortly
    </>
}

function GithubProfile(){
    let profile = cookies.get("github_profile")
    console.log(profile)
    return <>
        <Image src={profile.avatar_url} avatar/>
        <span>{profile.name}</span>
    </>
}

function Home(){
    let profile = cookies.get("github_profile")
    let button = <SigninWithGithubButton/>
    if(profile !== undefined){
        button = <GithubProfile/>
    }

    return <>
        {button}
    </>
}


function App() {
  return <div>
      <BrowserRouter>
          <Routes>
              <Route path="/authenticate" element={<Authenticate/>}/>
              <Route path="/topic/propose" element={<ProposeTopic/>} />
              <Route path="/topics" element={<Topics/>} />
              {/*<Route path="/topic/:topicId" element={<Topic/>} />*/}
              <Route path="/" element={<Home/>} />
          </Routes>
      </BrowserRouter>
  </div>
}

export default App;
