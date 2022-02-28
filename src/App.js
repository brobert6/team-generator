import { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/Home";

import PlayersPage from "./pages/Players";
import PlayersManagePage from "./pages/PlayersManage";
import ProfilePage from "./pages/Profile";

function App() {
  return (
    <Fragment>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/:team/" exact>
          <Layout>
            <PlayersPage />
          </Layout>
        </Route>
        <Route path="/:team/manage">
          <Layout>
            <PlayersManagePage />
          </Layout>
        </Route>
        <Route path="/:team/profile">
          <Layout>
            <ProfilePage />
          </Layout>
        </Route>
      </Switch>
    </Fragment>
  );
}

export default App;
