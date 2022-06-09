import Navbar from "./navbar";
import React from "react";
import {Link} from "react-router-dom";
import {Button, Container, Header, Icon} from "semantic-ui-react";

const HomepageHeading = ({ mobile }) => (
  <Container text>
    <Header
      as='h1'
      content='Polyglot Victoria Conference'

      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Header
      as='h2'
      content='A developer/tech focused in-person/remote-hybrid conference'
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
    <Button primary size='huge' as={Link} to="/about">
      Learn More
      <Icon name='right arrow' />
    </Button>
  </Container>
)


const TimeAndPlace = ({ mobile }) => (
  <Container text>
    <Header
      as='h2'
      content='August 6th 2022, 9am-5pm @ 777 Fort St'
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
    <Button secondary size='huge' as={Link} to="/topics">
      Topics
      <Icon name='right arrow' />
    </Button>
  </Container>
)

const GetInvolvedHeading = ({ mobile }) => (
  <Container text>

    <Header
      as='h2'
      content='Interested in getting involved?'
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
    <Button secondary size='big' as={"a"} href="mailto:volunteer@polyglotvictoria.ca">
      Volunteer
    </Button>
    <Button secondary size='big' as={"a"} href="mailto:sponsor@polyglotvictoria.ca">
      Sponsor us
    </Button>
  </Container>
)

function Home(){

    return <>
        <Navbar/>
        <HomepageHeading/>
        <TimeAndPlace/>
        <GetInvolvedHeading/>
    </>
}

export default Home