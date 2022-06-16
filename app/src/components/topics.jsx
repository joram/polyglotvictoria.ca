import React, {useState} from "react";
import {Button, Card, Container, Grid, Header, Icon, Label} from "semantic-ui-react";
import Navbar from "./navbar";
import Cookies from "universal-cookie";
import {Link} from "react-router-dom";
import {BrowserView, MobileView} from 'react-device-detect';
import {toast} from "react-semantic-toasts";

const cookies = new Cookies();
let profile = cookies.get("github_profile")

function promptLogin(){
    toast({
        title: 'Info',
        description: <p>To vote you must be signed in</p>
    });
}

function TopicVoting(props){
    let [voted_in_person, set_voted_in_person] = useState(props.topic.voted_in_person)
    let [voted_remote, set_voted_remote] = useState(props.topic.voted_remote)
    let [votes_in_person, set_votes_in_person] = useState(props.topic.votes_in_person)
    let [votes_remote, set_votes_remote] = useState(props.topic.votes_remote)
    console.log(props.topic)
    let remote_color = "grey"
    if(voted_remote){
        remote_color = "pink"
    }

    let in_person_color = "grey"
    if(voted_in_person){
        in_person_color = "pink"
    }

    function onClickRemote(){
        if(profile===undefined){
            promptLogin()
            return null
        }

        if(voted_remote){
            vote(props.topic.id, "none")
            set_voted_in_person(false)
            set_voted_remote(false)
            set_votes_remote(votes_remote-1)
        } else {
            vote(props.topic.id, "remote")
            set_voted_in_person(false)
            set_voted_remote(true)
            set_votes_remote(votes_remote+1)
            if(voted_in_person){
                set_votes_in_person(votes_in_person-1)
            }
        }
    }
    function onClickInPerson(){
        let profile = cookies.get("github_profile")
        if(profile===undefined){
            promptLogin()
            return null
        }

        if(voted_in_person){
            vote(props.topic.id, "none")
            set_voted_in_person(false)
            set_voted_remote(false)
            set_votes_in_person(votes_in_person-1)
        } else {
            vote(props.topic.id, "in_person")
            set_voted_in_person(true)
            set_voted_remote(false)
            set_votes_in_person(votes_in_person+1)
            if(voted_remote){
                set_votes_remote(votes_remote-1)
            }
        }
    }
    function vote(id, type){
        let isLocal = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "")
        let url = "https://polyglot.oram.ca/topic/"+id+"/vote"
        if(isLocal){
            url = "http://localhost:8000/topic/"+id+"/vote"
        }

        let data = {
            "type": type,
        }
        let sessionToken = cookies.get("session_token")
        let headers = {
            "session-token": sessionToken,
            "Accept": "application/json",
            'Content-Type': 'application/json',
        }
        fetch(url, {method:"POST", body:JSON.stringify(data), headers:headers}).then(
            response => response.text()
        )
    }

    let edit = null
    if(profile !== undefined && profile.login === "joram"){
        edit = <Link style={{marginLeft:"10px"}} to={"/topic/"+props.topic.id+"/edit"}>
            <Icon name='edit'/>
        </Link>
    }
    return <>
        <Icon style={{marginLeft:"10px"}} name='computer' color={remote_color} onClick={onClickRemote}/>
        <span style={{paddingRight:"10px"}}>{votes_remote} </span>
        <Icon name='user' color={in_person_color} onClick={onClickInPerson}/>
        {votes_in_person}
        {edit}
    </>
}

function ProposedTopics(props){
    let cards = []
    let colors = ["blue", "green"]
    let i = 0;
    let structureColors = {
        "talk": "light green",
        "round table": "light red",
        "panel": "light orange",
        "fish bowl": "light yellow",

    }
    props.topics.forEach((proposal) => {
        let color = colors[i%colors.length]
        i += 1
        cards.push(<Card color={color}>
            <Card.Content>
                <Card.Header>{proposal.title}</Card.Header>
                <Card.Description>{proposal.description}</Card.Description>
            </Card.Content>
            <Card.Content extra align="right">
                <Label color={structureColors[proposal.structure]}>{proposal.structure}</Label>
                <TopicVoting topic={proposal}/>
            </Card.Content>
        </Card>)
    })

    return <>
        <BrowserView>
            <Card.Group itemsPerRow={3}>{cards}</Card.Group>
        </BrowserView>
        <MobileView>
            <Card.Group itemsPerRow={1}>{cards}</Card.Group>
        </MobileView>
    </>
}

function Topics(){
    let [gettingTopics, setGettingTopics] = useState(false)
    let [proposedTopics, setproposedTopics] = useState([])

    if(!gettingTopics){
        setGettingTopics(true)
        getTopics()
    }

    function getTopics() {
        let isLocal = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "")
        let url = "https://polyglot.oram.ca/topics"
        if (isLocal) {
            url = "http://localhost:8000/topics"
        }

        function processJsonResponse(topics){
            console.log(topics)
            proposedTopics = []
            topics.forEach(topic => {
                if(topic.type === "proposed") {
                    proposedTopics.push(topic)
                }
            })
            setproposedTopics(proposedTopics)
        }

        let sessionToken = cookies.get("session_token")
        let headers = {
            "session-token": sessionToken,
            "Accept": "application/json",
        }
        fetch(url, {method: "GET", headers: headers, timeout: 1}).then(
            response => response.json()
        ).then(topics => processJsonResponse(topics)).catch(error =>{
            console.log("failed to talk to API server, using cache")
            let cache_url = "https://www.polyglotvictoria.ca/cache/topics.json"
            fetch(cache_url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(response => response.json()).then(data => {
                let topics = []
                data.topics.forEach(t => topics.push(JSON.parse(t)))
                processJsonResponse(topics)
            })
        })
    }

    return <>
        <Navbar/>

        <Container>
            <Header  textAlign="center">
                <div style={{fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;"}}>
                    These are topics proposed by the community.
                    If you are interested in one, mark yourself as interested.
                    <br/>
                    <br/>
                    <Icon name='computer' /> indicates remote
                    <br/>
                    <Icon name='user'/> indicates in person
                    <br/>
                    <br/>
                    We'll email you when the topic is scheduled.
                </div>
            </Header>
        </Container>
        <br/>

        <Container>
            <ProposedTopics topics={proposedTopics}/>
        </Container>
        <br/> <br/> <br/>

        <Container>
          <Grid>
            <Grid.Column textAlign="center">
                            <Header>
                <div style={{fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;"}}>
                    Not seeing a topic you are interested in?
                </div>
            </Header>
              <Button as={Link} to={"/topic/propose"}>Propose a Topic</Button>
            </Grid.Column>
          </Grid>
        </Container>

    </>
}


export default Topics;