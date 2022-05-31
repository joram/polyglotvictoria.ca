import React, {useState} from "react";
import {Dropdown, Image, Menu} from "semantic-ui-react";
import {Link} from "react-router-dom";
import Cookies from "universal-cookie";
import LoginButton from "./login_button";

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

    function handleItemClick(e, { name }){
        setPage(name)
        window.history.push("/"+page)
    }
      return <Menu inverted>

        <Menu.Item
          name='Polyglot Meetup'
          active={page === 'home'}
          onClick={handleItemClick}
          as={Link}
          to={"/"}
        >
          Polyglot Victoria Meetup
        </Menu.Item>

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
      }

  export default Navbar