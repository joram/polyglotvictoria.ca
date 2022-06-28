import Navbar from "./navbar";
import React from "react";
import {Link} from "react-router-dom";
import {Button, Container, Grid, Header, Icon, Image, Table} from "semantic-ui-react";

const HomepageHeading = ({ mobile }) => (
  <Container text textAlign="center">
      <br/>
    <Header
      as='h2'
      content='A software developer/tech focused in-person/remote-hybrid unconference based in Victoria BC'
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
      }}
    />
    <Button secondary size='huge' as={Link} to="/about">
      Learn More
      <Icon name='right arrow' />
    </Button>
  </Container>
)

const TimeAndPlace = ({ mobile }) => (
  <Container text textAlign="center">
    <Header
      as='h2'
      content='August 6th 2022, 9am-5pm @ 777 Fort St'
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
    <Button primary active={false} size='huge' as={"a"} href="https://www.eventbrite.ca/e/polyglot-victoria-unconference-tickets-370240267607">
      Registration
      <Icon name='right arrow' />
    </Button>
    <Button secondary size='huge' as={Link} to="/topics">
      Topics
      <Icon name='right arrow' />
    </Button>
  </Container>
)

const GetInvolvedHeading = ({ mobile }) => (
  <Container text textAlign="center">

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

const PolyglotDefinition = () => <>
    <Header>Polyglot</Header>
    Polyglot software development is the
    practice of utilizing multiple languages,
    frameworks and stacks to build
    software.
    The core of the Polyglot Conference is
    creating an opportunity to celebrate
    software development diversity and
    break away from typically
    language-specific user groups and
    conferences to come together to talk
    about the challenges and interests that
    we all have in common.
</>

const UnconferenceDefinition = () => <>
    <Header>Unconference</Header>
    An unconference, or “open space
    event,” is a participant driven conference.
    Participants, (in our case) <a href="/topics">propose</a> conference topics
    ahead of time, facilitated as
    talks, discussions, panels, fishbowls,
    and more. Open space events have an
    emphasis on spontaneous learning and
    sharing that differs from traditional
    conference formats. It's an experience
    like no other.
</>

function Definitions({mobile}) {
    if(mobile) {
        return <Container>
            <PolyglotDefinition/>
            <br/>
            <UnconferenceDefinition/>
        </Container>
    }
    return <Container text>
        <br/>
        <br/>
        <Table style={{border: "none"}}>
            <Table.Row verticalAlign={"top"}>
                <Table.Cell><PolyglotDefinition/></Table.Cell>
                <Table.Cell><UnconferenceDefinition/></Table.Cell>
            </Table.Row>
        </Table>
    </Container>
}

function Schedule({mobile}) {
    return <Container text textAlign="center">

        <Header as={"h2"}>Schedule</Header>
        <Table striped>
            <Table.Header>
                <Table.HeaderCell textAlign="right">Event</Table.HeaderCell>
                <Table.HeaderCell>Time</Table.HeaderCell>
            </Table.Header>
            <Table.Row>
                <Table.Cell textAlign="right">Registration</Table.Cell>
                <Table.Cell>8:30am (30min)</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell textAlign="right">Opening Remarks</Table.Cell>
                <Table.Cell>9:00am (30min)</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell textAlign="right">Session 1</Table.Cell>
                <Table.Cell>9:30am (50min)</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell textAlign="right">Session 2</Table.Cell>
                <Table.Cell>10:30am (50min)</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell textAlign="right">Session 3</Table.Cell>
                <Table.Cell>11:30am (50min)</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell textAlign="right">Lunch Break</Table.Cell>
                <Table.Cell>12:30am (50min)</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell textAlign="right">Session 4</Table.Cell>
                <Table.Cell>1:30pm (50min)</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell textAlign="right">Session 5</Table.Cell>
                <Table.Cell>2:30pm (50min)</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell textAlign="right">Session 6</Table.Cell>
                <Table.Cell>3:30pm (50min)</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell textAlign="right">Closing Remarks</Table.Cell>
                <Table.Cell>4:30pm (30min)</Table.Cell>
            </Table.Row>

        </Table>
    </Container>
}

function Sponsors({mobile}) {
    return <Container text textAlign="center">
        <Header as={"h2"}>Sponsored By</Header>
        <Grid>
            <Grid.Row>
                <Grid.Column as={"a"} href={"https://supergood.software/"}><Image centered src={"/sponsors/supergood.png"} size={"large"}/></Grid.Column>
            </Grid.Row>
        </Grid>
    </Container>
}


function Home(){

    return <>
        <Navbar/>
        <Image centered src="/PV_LOGO.svg" size="medium"/>
        <HomepageHeading/>
        <TimeAndPlace/>
        <Definitions/>
        <Sponsors/>
        <Schedule/>
        <GetInvolvedHeading/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
    </>
}

export default Home