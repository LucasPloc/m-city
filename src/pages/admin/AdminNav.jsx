import React from "react";
import { Link, withRouter, useHistory } from "react-router-dom";
import { ListItem } from "@mui/material";
import {
  showToastError,
  showToastSuccess,
  logoutHandler,
} from "../../components/utils/tools";

const AdminNav = () => {
  const history = useHistory();
  const links = [
    {
      title: "Matches",
      linkTo: "/admin-matches",
    },
    {
      title: "Players",
      linkTo: "/admin-players",
    },
  ];
  const renderLinks = () =>
    links.map((link) => (
      <Link to={link.linkTo} key={link.title}>
        <ListItem button className="admin_nav_link">
          {link.title}
        </ListItem>
      </Link>
    ));
  return (
    <div>
      {renderLinks()}
      <ListItem
        onClick={() => logoutHandler(history)}
        button
        className="admin_nav_link"
      >
        Log out
      </ListItem>
    </div>
  );
};

export default withRouter(AdminNav);
