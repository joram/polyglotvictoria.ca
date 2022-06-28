import React, {useState} from "react";
import {Container, Table} from "semantic-ui-react";
import Navbar from "./navbar";
import Cookies from "universal-cookie";

const cookies = new Cookies();


function AdminNotifyRegistrations(){
    let [gettingEmails, setGettingEmails] = useState(false)
    let [emails, setEmails] = useState([])

    if(!gettingEmails){
        setGettingEmails(true)
        getEmails()
    }

    function getEmails() {
        let isLocal = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "")
        let url = "https://polyglot.oram.ca/notify_registrations"
        if (isLocal) {
            url = "http://localhost:8000/notify_registrations"
        }

        let sessionToken = cookies.get("session_token")
        let headers = {
            "session-token": sessionToken,
            "Accept": "application/json",
        }
        fetch(url, {method: "GET", headers: headers}).then(
            response => response.json()
        ).then(data => {
            console.log(data)
            setEmails(data)
        })
    }

    let rows = []
    let i = 0
    emails.forEach(email => {
        rows.push(<Table.Row key={email+i++}>
        <Table.Cell>{email}</Table.Cell>
      </Table.Row>)
    })
    return <>
        <Navbar/>

        <Container>
             <Table striped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Emails</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                    {rows}
                </Table.Body>
             </Table>
        </Container>

    </>
}


export default AdminNotifyRegistrations;