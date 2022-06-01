import Navbar from "./navbar";
import React from "react";
import {Container} from "semantic-ui-react";
import Cookies from "universal-cookie";

const cookies = new Cookies();
function Logout(){
    cookies.remove("session_token")
    cookies.remove("github_profile")
    return <>
        <Navbar/>
        <Container>
            <p>
            you've been logged out
            </p>
        </Container>
    </>
}

export default Logout