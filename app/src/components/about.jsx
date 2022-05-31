import React from "react";
import {Container} from "semantic-ui-react";
import Navbar from "./navbar";
import {Link} from "react-router-dom";

function About(){
    return <>
        <Navbar/>
        <Container>
            <p>
                The Polyglot Meetup is a hybrid in-person/remote meetup open to anyone in the Victoria Tech community,
                where the <Link to="/topics">topics</Link> are driven by the participants.
            </p>
            <p>
                Anyone can <Link to="/topic/propose">propose a topic</Link>, and anyone can vote on the topics they are interested in.
            </p>
            <p>
                A topic can be facilitated in one of many formats:
                  - a standard talk by a single person
                  - an open discussion
                  - a predefined panel
                  - a fishbowl (adhoc/hotseat panel)
            </p>
            <p>
                # Covid safety
                We'll require (and verify) attendees are double vaccinated, and ask that everyone stay masked during the meetups.
                There will be limited capacity. For those who don't wish to attend in person, we'll setup a recorded zoom call
                and have a moderator monitor the chat for questions.
            </p>


        </Container>
    </>
}

export default About