import React from "react";
import { auth } from "../firebase";
import { Redirect } from "react-router-dom";

const AuthGuard = (Component) => {
  class AuthHoc extends React.Component {
    authCheck = () => {
      const user = auth.currentUser;
      if (user) {
        return <Component {...this.props} />;
      } else {
        return <Redirect to="/" />;
      }
    };
    render() {
      return this.authCheck();
    }
  }
  return AuthHoc;
};

export default AuthGuard;
