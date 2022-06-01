import React, {useState} from "react";
import {Button, Container, Form, Header, TextArea} from "semantic-ui-react";
import Navbar from "./navbar";
import Cookies from "universal-cookie";
import {toast} from "react-semantic-toasts";

const cookies = new Cookies();





function ProposeTopic(){
    let [title, setTitle] = useState()
    let [description, setDescription] = useState()
    let [type, setType] = useState()

    function submitForm(e){
        let isLocal = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "")
        let url = "https://polyglot.oram.ca/topic"
        if(isLocal){
            url = "http://localhost:8000/topic"
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
            window.location.replace("/topics")
        })
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
     <Header>Propose a Topic</Header>
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
  </Form>
    </Container>
        </>
}

export default ProposeTopic