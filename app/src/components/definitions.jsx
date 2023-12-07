import React from "react";
import {Container, Header} from "semantic-ui-react";
import Navbar from "./navbar";

let definition_data = [{
    word: "Unconference",
    slug: "unconference",
    definition: "a loosely structured conference emphasizing the informal exchange of information and ideas between " +
        "participants, rather than following a conventionally structured program of events.",
}, {
    word: "Talk",
    slug: "talk",
    definition: "One speaker, potentially with slides, gets up in front of the group and speaks on a subject.",
}, {
    word: "Tutorial",
    slug: "tutorial",
    definition: "One speaker, potentially with slides, gets up in front of the group and speaks on a subject. But there is an active audience participation element.",
}, {
    word: "Round Table",
    slug: "round_table",
    definition: "Everyone can talk, everyone can speak if they want, or just listen.",
}, {
    word: "Panel",
    slug: "panel",
    definition: "A predefined panel of experts get up and talk.",
}, {
    word: "Fishbowl",
    slug: "fishbowl",
    definition: "N seats of panelists, where one seat is always left empty. " +
        "So if you have something to say, come up, sit down and join the conversation. " +
        "If there are no empty seats and you haven't spoken in a while, you can make room and go sit in the audience.",
}]

function getActiveSlug(){
    let parts = window.location.href.split("#",  2)
    if(parts.length !== 2){
        return ""
    }
    return parts[1]
}

function Definition(props){

    let backgroundColor = "white";
    if(props.slug===props.activeSlug){
        backgroundColor = "yellow"
    }

    return <div style={{backgroundColor:backgroundColor, marginBottom:"30px"}}>
        <a name={props.slug} href={"/definitions#"+props.slug} onClick={() => props.onChange(props.slug) }>
            <Header as="h2" slug={props.slug}>
                {props.word}
            </Header>
        </a>
        <p>{props.definition}</p>
    </div>
}

class Definitions extends React.Component {

  constructor(props) {
    super(props)
    this.handler = this.handler.bind(this)
      this.state={
        activeSlug: getActiveSlug()
    }
  }

  handler(slug) {
    this.setState({activeSlug: slug})
  }


    render(){
        let definitions = [];
        definition_data.forEach(definition => definitions.push(<Definition
            onChange={this.handler}
            key={definition.word}
            word={definition.word}
            slug={definition.slug}
            activeSlug={this.state.activeSlug}
            definition={definition.definition}
        />))
        return <>
            <Navbar/>
            <Container style={{fontSize: "22px"}}>
                <Header as="h1">Definitions</Header>
                {definitions}
            </Container>
        </>

    }
}

export default Definitions