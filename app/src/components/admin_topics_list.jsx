import React, {useState} from "react";
import {Container, Table} from "semantic-ui-react";
import Navbar from "./navbar";
import Cookies from "universal-cookie";
import {Link} from "react-router-dom";

const cookies = new Cookies();


function AdminTopics(){
    let [gettingTopics, setGettingTopics] = useState(false)
    let [topics, setTopics] = useState([])

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

        let sessionToken = cookies.get("session_token")
        let headers = {
            "session-token": sessionToken,
            "Accept": "application/json",
        }
        fetch(url, {method: "GET", headers: headers}).then(
            response => response.json()
        ).then(data => {
            console.log(data)
            setTopics(data)
        })
    }

    let rows = []
    topics.forEach(topic => {
        rows.push(<Table.Row key={topic.id}>
        <Table.Cell>{topic.title}</Table.Cell>
            <Table.Cell><Link to={"/topic/"+topic.id+"/edit"}>edit</Link></Table.Cell>
        <Table.Cell><Link to={"/topic/"+topic.id+"/edit"}>delete</Link></Table.Cell>
      </Table.Row>)
    })
    return <>
        <Navbar/>

        <Container>
             <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Title</Table.HeaderCell>
                    <Table.HeaderCell>Edit</Table.HeaderCell>
                    <Table.HeaderCell>Delete</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                    {rows}
                </Table.Body>
             </Table>
        </Container>

    </>
}


export default AdminTopics;