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
        <Route path="/team-generator" exact>
          <HomePage />
        </Route>
        <Route path="/test" exact>
          <Fragment>
            <HomePage />
            <HomePage />
          </Fragment>
        </Route>
        <Route path="/:team(waldorf|scoala18)" exact>
          <Layout>
            <PlayersPage />
          </Layout>
        </Route>
        <Route path="/:team-manage" exact>
          <Layout>
            <PlayersManagePage />
          </Layout>
        </Route>
        <Route path="/:team-profile" exact>
          <Layout>
            <ProfilePage />
          </Layout>
        </Route>
      </Switch>
    </Fragment>
  );
}

export default App;
