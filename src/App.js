import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Route, Switch } from "react-router-dom";
import { onAuthStateChanged, auth } from "./firebase";

import AuthGuard from "./hoc/Auth";
import Home from "./pages/Home/Home";
import Signin from "./pages/Signin/Signin";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Team from "./components/Team/Team";
import NotFound from "./pages/NotFound/NotFound";
import MatchesTable from "./pages/MatchesTable/MatchesTable";
import Dashboard from "./pages/admin/Dashboard";
import AdminPlayers from "./pages/admin/Players";
import AdminMatches from "./pages/admin/Matches";
import AddEditMatches from "./pages/admin/AddEditMatches";
import AddEditPlayer from "./pages/admin/AddEditPlayers";

const App = () => {
  const [user, setUser] = useState(null);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });
  return (
    <>
      <Header user={user} />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/the_matches" component={MatchesTable} />
        <Route
          path="/signin"
          component={(props) => <Signin {...props} user={user} />}
        />
        <Route exact path="/dashboard" component={AuthGuard(Dashboard)} />
        <Route
          exact
          path="/admin-players"
          component={AuthGuard(AdminPlayers)}
        />
        <Route
          exact
          path="/admin-players/add-player"
          component={AuthGuard(AddEditPlayer)}
        />
        <Route
          exact
          path="/admin-players/edit-player/:id"
          component={AuthGuard(AddEditPlayer)}
        />
        <Route
          exact
          path="/admin-matches"
          component={AuthGuard(AdminMatches)}
        />
        <Route
          exact
          path="/admin-matches/add-match"
          component={AuthGuard(AddEditMatches)}
        />
        <Route
          exact
          path="/admin-matches/edit-match/:id"
          component={AuthGuard(AddEditMatches)}
        />
        <Route exact path="/the_team" component={Team} />
        <Route component={NotFound} />
      </Switch>
      <ToastContainer />
      <Footer />
    </>
  );
};

export default App;
