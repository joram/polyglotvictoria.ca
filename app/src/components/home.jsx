import Navbar from "./navbar";
import React from "react";
import {Link} from "react-router-dom";
import {Button, Container, Header, Icon} from "semantic-ui-react";

const HomepageHeading = ({ mobile }) => (
  <Container text>
    <Header
      as='h1'
      content='Victoria Developer Polyglot Meetup'

      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Header
      as='h2'
      content='A tech focused remote-hybrid meetup group'
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
    <Button secondary size='big' as={"a"} href="mailto:volunteers@polyglotmeetup.ca">
      Volunteer
    </Button>
    <Button secondary size='big' as={"a"} href="mailto:sponsors@polyglotmeetup.ca">
      Sponsor us
    </Button>
  </Container>
)

function Home(){

    return <>
        <Navbar/>
        <HomepageHeading/>
        <GetInvolvedHeading/>
    </>
}

export default Home