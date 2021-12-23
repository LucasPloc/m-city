import { Fragment } from "react";
import { AppBar, Button, Toolbar } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { CityLogo, logoutHandler } from "../utils/tools";

const Header = ({ user }) => {
  const history = useHistory();

  return (
    <AppBar
      position="fixed"
      style={{
        background: "#98c5e9",
        boxShadow: "none",
        padding: "10px 0px",
        borderBottom: "2px solid #00285e",
      }}
    >
      <Toolbar style={{ display: "flex" }}>
        <div style={{ flexGrow: "1" }}>
          <div className="header_logo">
            <CityLogo link={true} linkTo="/" width="70px" height="70px" />
          </div>
        </div>
        <Link to="/the_team">
          <Button color="inherit">The team</Button>
        </Link>
        <Link to="/the_matches">
          <Button color="inherit">Matches</Button>
        </Link>{" "}
        {user && (
          <Fragment>
            {" "}
            <Link to="/dashboard">
              <Button color="inherit">Dashboard</Button>
            </Link>
            <Button onClick={() => logoutHandler(history)} color="inherit">
              Log out
            </Button>
          </Fragment>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
