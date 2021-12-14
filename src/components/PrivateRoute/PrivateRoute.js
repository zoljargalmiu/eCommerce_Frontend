import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = ({ component: Component, showHeader, user, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        user.loggingIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

function mapState(state) {
  const { authentication } = state;
  return { user: authentication };
}

const connectedPrivateRoute = connect(mapState, null)(PrivateRoute);
export { connectedPrivateRoute as PrivateRoute };
