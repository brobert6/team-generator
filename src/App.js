import { Route, Switch } from "react-router-dom";
import Layout from "./components/layout/Layout";

import PlayersPage from "./pages/Players";
import PlayersManagePage from "./pages/PlayersManage";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <PlayersPage />
        </Route>
        <Route path="/manage">
          <PlayersManagePage />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
