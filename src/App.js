import React from "react";
import { Router, Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createBrowserHistory } from "history";
import { alertActions } from "./_actions";
import { RouteContainer } from "./components";
import { Login } from "./pages/Login/Login";
import { message } from "antd";

export const history = createBrowserHistory();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    history.listen((location, action) => {
      this.props.clearAlerts();
    });
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.alert !== this.props.alert) {
      if (this.props.alert.type === "alert-danger") {
        message.error(this.props.alert.message);
      } else if (this.props.alert.type === "alert-success") {
        message.success(this.props.alert.message);
      }
    }
  };

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/login" component={Login} />
          <RouteContainer />
        </Switch>
      </Router>
    );
  }
}

function mapState(state) {
  const { alert, authentication } = state;
  return { alert, user: authentication };
}

const actionCreators = {
  clearAlerts: alertActions.clear,
};

const connectedApp = connect(mapState, actionCreators)(withRouter(App));
export { connectedApp as App };
