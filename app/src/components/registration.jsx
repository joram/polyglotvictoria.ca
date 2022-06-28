import React from "react";
import {Button, Container, Form, Header, Input} from "semantic-ui-react";
import Navbar from "./navbar";
import {toast} from "react-semantic-toasts";

function Registration(props){
    function onSubmit(e){
        console.log(e)
        let email = document.getElementById("email").value
        console.log(email)
        let isLocal = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "")
        let url = "https://polyglot.oram.ca/notify_registration"
        if (isLocal) {
            url = "http://localhost:8000/notify_registration"
        }

        let headers = {
            "Accept": "application/json",
            'Content-Type': 'application/json',
        }
        fetch(url, {method: "POST", body:JSON.stringify({"email":email}), headers: headers, timeout: 1}).then(
            response => response.json()
        ).then(() => {
            setTimeout(() => {
                window.location.replace("/")
            }, 4000)
            toast({
                      title: 'Info',
                      description: <p>We will email you when registration opens</p>
            })

        })
    }

    return <>
        <Navbar/>
        <Container>
            <Header
            as='h2'
            content='Registration will open soon. To by notified when it does, please drop your email below.'
            />
            <Form onSubmit={onSubmit}>
                <Form.Field>
                  <label>Email</label>
                  <Input placeholder='email' id="email"/>
                </Form.Field>
                <Button type='submit'>Submit</Button>
          </Form>
        </Container>
    </>
}


export default Registration
