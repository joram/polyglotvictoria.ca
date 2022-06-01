import React from "react";
import GithubButton from 'react-github-login-button'

async function githubLoginURL() {
    let isLocal = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "")
    let url = "https://polyglot.oram.ca/auth/github_url"
    if(isLocal){
        url = "http://localhost:8000/auth/github_url"
    }

    return fetch(url).then(response => response.text()).then(response => response.replace(/['"]+/g, ''))
}

function LoginButton() {

    function onClick() {
        githubLoginURL().then(href => {
            window.location.replace(href)
        })
    }

  return <GithubButton onClick={onClick}/>
}

export default LoginButton;
