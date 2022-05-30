import GithubButton from 'react-github-login-button'

async function githubLoginURL() {
    return fetch("http://127.0.0.1:8000/auth/github_url").then(response => response.text()).then(response => response.replace(/['"]+/g, ''))
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
