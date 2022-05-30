import './App.css';
import LoginButton from "./components/login_button";
import { BrowserRouter, useSearchParams } from "react-router-dom";
import {Route, Routes} from "react-router";
import {useEffect, useState} from "react";

function NotLoggedIn(){
    return <>
        <LoginButton/>
    </>
}

function Login(){
    console.log("rendering the authed page")
    const [searchParams] = useSearchParams();
    let [profileDataRequested, setProfileDataRequested] = useState(false)
    let [profileData, setProfileData] = useState({})
    let code = searchParams.get("code")
    let state = searchParams.get("state")

    if(!profileDataRequested){
        setProfileDataRequested(true)
        let url = "http://127.0.0.1:8000/auth?code="+code+"&state="+state
        fetch(url).then(response => response.json()).then(data =>{
          console.log(data)
            if(data["login"]){
                console.log("setting state to ", data)
                setProfileData(data)
            }
        })
    }

    return <>
        you are authed
        {JSON.stringify(profileData)}
    </>
}


function App() {
  return <div>
      <BrowserRouter>
          <Routes>
              <Route path="/login" element={<Login/>}/>
              <Route path="/" element={<NotLoggedIn/>} />
          </Routes>
      </BrowserRouter>
  </div>
}

export default App;
