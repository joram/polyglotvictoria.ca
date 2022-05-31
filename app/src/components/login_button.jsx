import React from "react";
import GithubButton from 'react-github-login-button'

async function githubLoginURL() {
    return fetch("https://polyglot.oram.ca/auth/github_url").then(response => response.text()).then(response => response.replace(/['"]+/g, ''))
}

function LoginButton() {

    function onClick() {
        githubLoginURL().then(href => {
            console.log("got ", href)
            window.location.replace(href)

        })
    }

  return <GithubButton onClick={onClick}/>
}

export default LoginButton;
