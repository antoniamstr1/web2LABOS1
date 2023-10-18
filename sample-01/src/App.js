import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import ExternalApi from "./views/ExternalApi";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";
import PopisNatjecanja from "./components/PopisNatjecanja";
// styles
import "./App.css";
import Auth0ProviderWithHistory from "./auth0Provider"
// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
import NatjecanjaKorisnik from "./components/natjecanjaKorisnik";
import PostNatjecanje from "./components/PostNatjecanje";
import IzabranoNatjecanje from "./components/IzabranoNatjecanje";
initFontAwesome();

const App = () => {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
      <Auth0ProviderWithHistory>
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={PopisNatjecanja} />
            <Route path="/kreirajNatjecanje" component={PostNatjecanje} />
            <Route path="/urediNatjecanje" component={NatjecanjaKorisnik} />
            <Route path="/natjecanje/:naziv" exact  component={IzabranoNatjecanje} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
      </Auth0ProviderWithHistory>
  );
};

export default App;
