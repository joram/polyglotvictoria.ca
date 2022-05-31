import React from "react";
import {Button, Card, Container, Form, Header, Icon, TextArea} from "semantic-ui-react";

let completedTopics = [{
    "title": "how to become a senior",
    "description": "All things related to bringing a developer to a senior level. either yourself or those you are mentoring or leading.",
    "votes": 22,
},{
    "title": "how to become a senior",
    "description": "All things related to bringing a developer to a senior level. either yourself or those you are mentoring or leading.",
    "votes": 22,
}]

let scheduledTopics = [{
    "title": "how to become a senior",
    "description": "All things related to bringing a developer to a senior level. either yourself or those you are mentoring or leading.",
    "votes_in_person": 22,
    "votes_virtual": 11,
    "datetime": "2022, March 3rd, 7pm",
},{
    "title": "how to become a senior",
    "description": "All things related to bringing a developer to a senior level. either yourself or those you are mentoring or leading.",
    "votes": 22,
}]


let proposedTopics = [{
    "title": "how to become a senior",
    "description": "All things related to bringing a developer to a senior level. either yourself or those you are mentoring or leading.",
    "votes": 22,
},{
    "title": "how to become a senior",
    "description": "All things related to bringing a developer to a senior level. either yourself or those you are mentoring or leading.",
    "votes": 22,
},{
    "title": "how to become a senior",
    "description": "All things related to bringing a developer to a senior level. either yourself or those you are mentoring or leading.",
    "votes": 22,
},{
    "title": "how to become a senior",
    "description": "All things related to bringing a developer to a senior level. either yourself or those you are mentoring or leading.",
    "votes": 22,
},{
    "title": "how to become a senior",
    "description": "All things related to bringing a developer to a senior level. either yourself or those you are mentoring or leading.",
    "votes": 22,
},{
    "title": "how to become a senior",
    "description": "All things related to bringing a developer to a senior level. either yourself or those you are mentoring or leading.",
    "votes": 22,
},{
    "title": "how to become a senior",
    "description": "All things related to bringing a developer to a senior level. either yourself or those you are mentoring or leading.",
    "votes": 22,
},{
    "title": "how to become a senior",
    "description": "All things related to bringing a developer to a senior level. either yourself or those you are mentoring or leading.",
    "votes": 22,
},{
    "title": "how to become a senior",
    "description": "All things related to bringing a developer to a senior level. either yourself or those you are mentoring or leading.",
    "votes": 22,
},{
    "title": "how to become a senior",
    "description": "All things related to bringing a developer to a senior level. either yourself or those you are mentoring or leading.",
    "votes": 22,
},{
    "title": "how to become a senior",
    "description": "All things related to bringing a developer to a senior level. either yourself or those you are mentoring or leading.",
    "votes": 22,
},]



function ScheduledTopics(){
    let cards = []
    let colors = ["orange", "red"]
    let i = 0;
    scheduledTopics.forEach((proposal) => {
        let color = colors[i%colors.length]
        i += 1
        cards.push(<Card color={color}>
            <Card.Content>
                <Card.Header>{proposal.title}</Card.Header>
                <Card.Description>{proposal.description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                {proposal.datetime}
            </Card.Content>
            <Card.Content extra align="right">
                <Icon name='user' />
                {proposal.votes_in_person}

                <Icon name='computer' />
                {proposal.votes_virtual}
            </Card.Content>
        </Card>)
    })
    return <Card.Group>
        {cards}
    </Card.Group>
}

function ProposedTopics(){
    let cards = []
    let colors = ["blue", "green"]
    let i = 0;
    proposedTopics.forEach((proposal) => {
        let color = colors[i%colors.length]
        i += 1
        cards.push(<Card color={color}>
            <Card.Content>
                <Card.Header>{proposal.title}</Card.Header>
                <Card.Description>{proposal.description}</Card.Description>
            </Card.Content>
            <Card.Content extra align="right">
                <Icon name='heart' />
                {proposal.votes}
            </Card.Content>
        </Card>)
    })
    return <Card.Group>
        {cards}
    </Card.Group>
}

function CompletedTopics(){
    let cards = []
    let colors = ["black", "grey"]
    let i = 0;
    completedTopics.forEach((proposal) => {
        let color = colors[i%colors.length]
        i += 1
        cards.push(<Card color={color}>
            <Card.Content>
                <Card.Header>{proposal.title}</Card.Header>
                <Card.Description>{proposal.description}</Card.Description>
            </Card.Content>
            <Card.Content extra align="right">
                <Icon name='heart' />
                {proposal.votes}
            </Card.Content>
        </Card>)
    })
    return <Card.Group>
        {cards}
    </Card.Group>
}

function Topics(){
    return <>
        <Container>
            <Header>Scheduled</Header>
            <ScheduledTopics/>
        </Container>
        <br/>
        <br/>
        <br/>

        <Container>
            <Header>Proposed/Voting</Header>
            <ProposedTopics/>
        </Container>
        <br/>
        <br/>
        <br/>

        <Container>
            <Header>History</Header>
            <CompletedTopics/>
        </Container>

    </>
}


export default Topics;