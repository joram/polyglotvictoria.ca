import React, {useState} from "react";
import {Dropdown, Header, Image, Menu, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import Cookies from "universal-cookie";
import LoginButton from "./login_button";
import {SemanticToastContainer} from 'react-semantic-toasts';
import {BrowserView, MobileView} from 'react-device-detect';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

const cookies = new Cookies();

function GithubProfile(){
    let profile = cookies.get("github_profile")
    if(profile===undefined){
        return null
    }
    return <>
        <Image src={profile.avatar_url} avatar/>
        <span>{profile.name}</span>
    </>
}

function Navbar(){
    let currentPage = window.location.pathname
    let [page, setPage] = useState(currentPage)
    let topRight = <Dropdown item text={<GithubProfile/>}>
      <Dropdown.Menu>
        <Dropdown.Item as={Link} to={"/topic/propose"}>Propose Topic</Dropdown.Item>
        <Dropdown.Item as={Link} to={"/logout"}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>

    let profile = cookies.get("github_profile")
    if(profile===undefined){
        topRight = <LoginButton/>
    }

    let itemStyle = {
        paddingTop: 0,
        paddingBottom: 0,
    }
    function handleItemClick(e, { name }){
        setPage(name)
        window.history.push("/"+page)
    }
      return <>
        <MobileView>
            <Segment inverted>
                <Header textAlign="center" style={{paddingTop:"10px"}}>
                    Polyglot Victoria
                </Header>
                  <Menu inverted>
                    <Menu.Item
                      name='about'
                      active={page === 'about'}
                      onClick={handleItemClick}
                      as={Link}
                      to={"/about"}
                    >
                      About
                    </Menu.Item>

                    <Menu.Item
                      name='topics'
                      active={page === 'topics'}
                      onClick={handleItemClick}
                      as={Link}
                      to={"/topics"}
                    >
                      Topics
                    </Menu.Item>
                                <Menu.Menu position='right'>
                    {topRight}
                  </Menu.Menu>

                  </Menu>
                    </Segment>
                </MobileView>
            <BrowserView>
              <Menu inverted>

            <Menu.Item
              name='Polyglot Victoria Unconference'
              active={page === 'home'}
              onClick={handleItemClick}
              as={Link}
              to={"/"}
              style={{paddingLeft:"5px", paddingTop: 0, paddingBottom: 0}}
            >
              <Image src="/PV_LOGO_NoTxt.svg" size="mini" style={{paddingRight:"5px"}}/>
              Polyglot Victoria Unconference
            </Menu.Item>

            <Menu.Item
              name='about'
              active={page === 'about'}
              onClick={handleItemClick}
              as={Link}
              to={"/about"}
              style={itemStyle}
            >
              About
            </Menu.Item>

            <Menu.Item
              name='topics'
              active={page === 'topics'}
              onClick={handleItemClick}
              as={Link}
              to={"/topics"}
              style={itemStyle}
            >
              Topics
            </Menu.Item>

              <Menu.Menu position='right'>
                {topRight}
              </Menu.Menu>

          </Menu>
        </BrowserView>
        <SemanticToastContainer />;
      </>
      }

  export default Navbar