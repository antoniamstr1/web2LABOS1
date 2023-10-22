import React, { useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse, Container, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Button } from "reactstrap";
import { useAuth0 } from "@auth0/auth0-react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
    isLoading,
  } = useAuth0();
  const toggle = () => setIsOpen(!isOpen);

  const logoutWithRedirect = () =>
      logout({
        returnTo: window.location.origin,
      });

  return (
      <div className="nav-container">
        <Navbar color="light" light expand="md" container={false}>
          <Container>
            <NavbarBrand className="logo" />
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <NavLink
                      tag={RouterNavLink}
                      to="/"
                      exact
                      activeClassName="router-link-exact-active"
                  >
                    popis natjecanja
                  </NavLink>
                </NavItem>
                {isAuthenticated && (
                    <>
                      <NavItem>
                        <NavLink
                            tag={RouterNavLink}
                            to="/kreirajNatjecanje"
                            exact
                            activeClassName="router-link-exact-active"
                        >
                          kreiraj natjecanje
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                            tag={RouterNavLink}
                            to="/urediNatjecanje"
                            exact
                            activeClassName="router-link-exact-active"
                        >
                          uredi natjecanje
                        </NavLink>
                      </NavItem>
                    </>
                )}
              </Nav>
              <Nav className="d-none d-md-block" navbar>
                {!isAuthenticated ? (
                    <NavItem>
                      <Button
                          id="qsLoginBtn"
                          color="primary"
                          className="btn-margin"
                          onClick={() => loginWithRedirect()}
                      >
                        Log in
                      </Button>
                    </NavItem>
                ) : (
                    <NavItem>
                      <Button
                          id="qsLogoutBtn"
                          color="primary"
                          className="btn-margin"
                          onClick={() => logoutWithRedirect()}
                      >
                        Log Out
                      </Button>
                    </NavItem>
                )}
              </Nav>
              {!isAuthenticated && (
                  <Nav className="d-md-none" navbar>
                    <NavItem>
                      <Button
                          id="qsLoginBtn"
                          color="primary"
                          block
                          onClick={() => loginWithRedirect({})}
                      >
                        Log in
                      </Button>
                    </NavItem>
                  </Nav>
              )}
              {isAuthenticated && (
                  <Nav
                      className="d-md-none justify-content-between"
                      navbar
                      style={{ minHeight: 170 }}
                  >


                    <NavItem>
                      <FontAwesomeIcon icon="power-off" className="mr-3" />
                      <RouterNavLink
                          to="#"
                          id="qsLogoutBtn"
                          onClick={() => logoutWithRedirect()}
                      >
                        Log out
                      </RouterNavLink>
                    </NavItem>
                  </Nav>
              )}
            </Collapse>
          </Container>
        </Navbar>
      </div>
  );
};

export default NavBar;
