import React from "react";
import {Button, Container, Form, Header, TextArea} from "semantic-ui-react";
import Navbar from "./navbar";

function ProposeTopic(){
    return      <>
        <Navbar/>
        <Container>
 <Form>
     <Header>Propose a Topic</Header>
        <Form.Field>
          <label>First Name</label>
          <input placeholder='256 character title' />
        </Form.Field>
        <Form.Field>
          <label>Last Name</label>
          <TextArea placeholder='1024 character description' />
        </Form.Field>
        <Form.Field>
          <label>Type</label>
            <Button.Group>
                <Button>Talk</Button>
                <Button>Round Table</Button>
                <Button>Panel</Button>
                <Button>Fishbowl</Button>
            </Button.Group>
        </Form.Field>
        <Form.Field>
          <label>Your Involvement</label>
            <Button.Group>
                <Button>I'm an expert</Button>
                <Button>I'm an interested novice</Button>
            </Button.Group>
        </Form.Field>
        <Button type='submit'>Submit</Button>
  </Form>
    </Container>
        </>
}

export default ProposeTopic