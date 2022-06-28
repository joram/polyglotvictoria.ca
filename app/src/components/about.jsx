import React from "react";
import {Container, Header, Image, List} from "semantic-ui-react";
import Navbar from "./navbar";
import {Link} from "react-router-dom";

function About(){
    return <>
        <Navbar/>
        <Container style={{fontSize: "22px"}}>
            <Image floated="right" src="/PV_LOGO.svg" size="medium" />

            <br/>
            <br/>
            <br/>
            <Header as="h2">Polyglot Victoria</Header>
            <p>
                The Polyglot Victoria Unconference is a hybrid in-person/remote <a href="/definitions#unconference">unconference</a> open to anyone in the Victoria Tech community,
                where the <Link to="/topics">topics</Link> are driven by the participants.
            </p>

            <Header as="h2">How It Works</Header>
            <Header as="h3">Topics are proposed</Header>
            <p>
                Anyone can <Link to="/topic/propose">propose a topic</Link>, and anyone can vote on the topics they are interested in.
            </p>
            <Header as="h3">Topics are voted on</Header>
            <p>
                A topic can be facilitated in one of many formats:
                <List>
                    <List.Item>
                        <a href="/definitions#talk">Talk</a>
                    </List.Item>
                    <List.Item>
                        <a href="/definitions#round_table">Round Table</a>
                    </List.Item>
                    <List.Item>
                        <a href="/definitions#panel">Panel</a>
                    </List.Item>
                    <List.Item>
                        <a href="/definitions#fishbowl">Fishbowl</a>
                    </List.Item>
                </List>
            </p>

            <Header as="h3">Topics take place</Header>
            <p>
                The highest voted topics are scheduled and coordinated.
                We'll stream the conversation over zoom for those who wish to be
                remote.
            </p>


            <Header as="h2">Covid Protocols</Header>
            <p>
                We'll require (and verify) in-person attendees are double vaccinated, and ask
                that everyone stay masked during the unconference. There will be limited
                capacity. There will be a moderator on the zoom call, to surface questions
                and discussion to the speaker/panel/group.
            </p>


        </Container>
    </>
}

export default About