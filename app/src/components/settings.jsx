import Navbar from "./navbar";
import React, {useState} from "react";
import Cookies from "universal-cookie";
import {Button, Checkbox, Container, Form, Header} from "semantic-ui-react";

const cookies = new Cookies();

function Settings(){
    let [gettingSettings, setGettingSettings] = useState(false)
    let [settings, setSettings] = useState({})
    let [email, setEmail] = useState("")
    let [contactGeneral, setContactGeneral] = useState(false)
    let [contactTopic, setContactTopic] = useState(false)

    if(!gettingSettings){
        setGettingSettings(true)
        getSettings()
    }

    function emailOnChange(v){
        settings.email = v
        setSettings(settings)
        setEmail(v)
    }

    function contactGeneralOnClick(){
        let checked = document.getElementById("contact_general").checked
        settings.contact_me_general = checked
        setSettings(settings)
        setContactGeneral(checked)

        console.log("contact me in general ", checked)
        console.log(settings)
    }

    function contactTopicOnClick(){
        let checked = document.getElementById("contact_topic").checked
        settings.contact_me_topic_chosen = checked
        setSettings(settings)
        setContactTopic(checked)

        console.log("contact me topic ", checked)
        console.log(settings)
    }

    function submitForm(e){
        let isLocal = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "")
        let url = "https://polyglot.oram.ca/user"
        if(isLocal){
            url = "http://localhost:8000/user"
        }

        let sessionToken = cookies.get("session_token")
        let headers = {
            "session-token": sessionToken,
            "Accept": "application/json",
            'Content-Type': 'application/json',
        }
        return fetch(url, {method:"POST", body:JSON.stringify(settings), headers:headers}).then(
            response => response.text()
        ).then(response => {
            window.location.replace("/settings")
        })
    }

    function getSettings() {
        let isLocal = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "")
        let url = "https://polyglot.oram.ca/user"
        if (isLocal) {
            url = "http://localhost:8000/user"
        }

        function processJsonResponse(data) {
            console.log(data)
            document.getElementById("contact_general").value = data.contact_me_general
            setSettings(data)
            setEmail(data.email)
            setContactGeneral(data.contact_me_general)
            setContactTopic(data.contact_me_topic_chosen)
        }

        let sessionToken = cookies.get("session_token")
        let headers = {
            "session-token": sessionToken,
            "Accept": "application/json",
        }
        fetch(url, {method: "GET", headers: headers, timeout: 1}).then(
            response => response.json()
        ).then(
            data => processJsonResponse(data)
        )
    }

    return <>
        <Navbar/>
    <Container>
        <Form>
             <Header>Edit ({settings.name})</Header>
                <Form.Field>
                  <label>Email</label>
                  <input
                      placeholder='256 character limit title'
                      value={email}
                      onChange={(e) => {emailOnChange(e.target.value)}}
                  />
                </Form.Field>

                <Form.Field>
                    <Checkbox
                      // toggle
                      id="contact_general"
                      label={{ children: 'Contact for Event Updates' }}
                      onChange={(e) => {contactGeneralOnClick()}}
                      checked={contactGeneral}
                    />
                </Form.Field>

                <Form.Field>
                    <Checkbox
                      // toggle
                      id="contact_topic"
                      label={{ children: 'Contact when Interested Topic is Scheduled' }}
                      onChange={(e) => {contactTopicOnClick()}}
                      checked={contactTopic}
                    />
                </Form.Field>

                <Button type='submit' onClick={submitForm}>Submit</Button>
          </Form>
    </Container>
    </>
}

export default Settings