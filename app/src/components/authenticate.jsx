import {useNavigate, useSearchParams} from "react-router-dom";
import React from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

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

export default Authenticate