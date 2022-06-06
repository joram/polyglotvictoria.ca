import React, {useState} from "react";
import {Button, Container, Form, Header, Image, Table, TextArea} from "semantic-ui-react";
import Navbar from "./navbar";
import Cookies from "universal-cookie";
import {toast} from "react-semantic-toasts";
import {useParams} from "react-router";

const cookies = new Cookies();



function VoteTable(props){
    let rows = []
    props.voted.forEach(user => {
        rows.push(<Table.Row key={user.id}>
        <Table.Cell><Image src={user.avatar_url} avatar as={"a"} href={"https://github.com/"+user.login}/></Table.Cell>
            <Table.Cell>{user.name}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>

      </Table.Row>)
    })
    return <Table celled columns={3}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Avatar</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body >
            {rows}
        </Table.Body>
     </Table>

}

function EditTopic(){
    let { topic_id } = useParams();
    let [gettingTopic, setGettingTopic] = useState(false)
    let [title, setTitle] = useState()
    let [description, setDescription] = useState()
    let [type, setType] = useState()
    let [voted, setVoted] = useState([])

    function getTopic(){
        let isLocal = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "")
        let url = "https://polyglot.oram.ca/topic/"+topic_id
        if(isLocal){
            url = "http://localhost:8000/topic/"+topic_id
        }

        let sessionToken = cookies.get("session_token")
        let headers = {
            "session-token": sessionToken,
            "Accept": "application/json",
            'Content-Type': 'application/json',
        }
        return fetch(url, {method:"GET", headers:headers}).then(
            response => response.json()
        ).then(data => {
            console.log(data)
            setTitle(data.title)
            setDescription(data.description)
            setType(data.type)
            setVoted(data.voted)
        })
    }

    function submitForm(){
        let isLocal = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "")
        let url = "https://polyglot.oram.ca/topic/"+topic_id
        if(isLocal){
            url = "http://localhost:8000/topic/"+topic_id
        }

        let data = {
            "title": title,
            "description": description,
            "structure": type,
        }
        let sessionToken = cookies.get("session_token")
        let headers = {
            "session-token": sessionToken,
            "Accept": "application/json",
            'Content-Type': 'application/json',
        }
        return fetch(url, {method:"POST", body:JSON.stringify(data), headers:headers}).then(
            response => response.text()
        ).then(response => {
        })
    }

    if(!gettingTopic){
        setGettingTopic(true)
        getTopic()
    }

    let profile = cookies.get("github_profile")
    if(profile===undefined){
         setTimeout(() => {toast({
            title: 'Info',
            description: <p>To propose a topic you must be signed in</p>
        })}, 500)
         return <>
            <Navbar/>
                <Container style={{fontSize: "22px"}}>
            <p>You must be logged in with github account to propose topics.</p>
                </Container>
        </>
    }

    return <>
        <Navbar/>
        <Container>
 <Form>
     <Header>Edit Topic</Header>
        <Form.Field>
          <label>Title</label>
          <input
              placeholder='256 character limit title'
              value={title}
              onChange={(e) => {setTitle(e.target.value)}}
          />
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <TextArea
              placeholder='1024 character limit title'
              value={description}
              onChange={(e) => {setDescription(e.target.value)}}
          />
        </Form.Field>
        <Form.Field>
          <label>Type</label>
            <Button.Group>
                <Button onClick={() => {setType("talk")}}>Talk</Button>
                <Button onClick={() => {setType("round table")}}>Round Table</Button>
                <Button onClick={() => {setType("panel")}}>Panel</Button>
                <Button onClick={() => {setType("fish bowl")}}>Fishbowl</Button>
            </Button.Group>
        </Form.Field>
        <Button type='submit' onClick={submitForm}>Submit</Button>

        <h2>Favourited</h2>
        <VoteTable voted={voted} />
  </Form>
    </Container>
        </>
}

export default EditTopic