import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import LanguageDropDown from "../dropdowns/LanguageDropDown";
import { MdSettings } from "react-icons/md";

function LandingPageNavbar() {
  return (
    <Navbar expand="lg" className="bg-body-white">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LanguageDropDown />
          </Nav>
          <Nav className="ms-3">
            <Nav.Link href="http://3.110.77.134:81" target="_blank">
              <MdSettings size={"30px"} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default LandingPageNavbar;
