import Navbar from "./navbar";
import React from "react";
import {Link} from "react-router-dom";
import {Container} from "semantic-ui-react";

function Home(){

    return <>
        <Navbar/>
        <Container>
            <p>
            Welcome to Victoria BC Canada's Polyglot meetup group.
            </p>
            <p>
            List of scheduled topics here
            </p>
            <p>
            TLDR here (with link to <Link to="/about">about</Link> page)
            </p>
            <p>
            Quick sponsor and Volunteer contact info here.
            </p>
            <p>
            Big Link to Topics section here.
            </p>
        </Container>
    </>
}

export default Home