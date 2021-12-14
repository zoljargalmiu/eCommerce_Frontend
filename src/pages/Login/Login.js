import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import Logo from "../../assets/images/pngegg.png";
import { userActions, alertActions } from "../../_actions";
import { connect } from "react-redux";

function Login(props) {
  const [form] = Form.useForm();
  const [buttonLoading, setLoading] = useState(false);

  useEffect(() => {
    props.logout();
  }, []);

  const onFinish = (values) => {
    const { username, password } = values;
    setLoading(true);
    if (username && password) {
      props.login(username, password).then((response) => {
        setLoading(false);
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="bg-gray bg-pattern vh-100">
      <div className="account-pages pt-sm-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center mb-5">
                <img src={Logo} height="100" alt="logo" />
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-xl-5 col-sm-8">
              <div className="card">
                <div className="card-body p-4">
                  <div className="p-2">
                    <h5 className="mb-5 text-center">Login eCommerce</h5>
                    <Form
                      className="form-horizontal"
                      form={form}
                      name="login-form"
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                      layout="vertical"
                    >
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group mb-4">
                            <Form.Item
                              label="Username"
                              name="username"
                              rules={[
                                {
                                  required: true,
                                  message: "Please fill your username",
                                },
                              ]}
                            >
                              <Input type="text" />
                            </Form.Item>
                          </div>

                          <div className="form-group mb-4">
                            <Form.Item
                              label="Password"
                              name="password"
                              rules={[
                                {
                                  required: true,
                                  message: "Please fill your password",
                                },
                              ]}
                            >
                              <Input.Password />
                            </Form.Item>
                          </div>
                          <div className="mt-4">
                            <Button
                              type="primary"
                              size="large"
                              className={
                                "btn btn-success btn-block waves-effect waves-light"
                              }
                              htmlType="submit"
                              loading={buttonLoading}
                            >
                              Login
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="version-code">v1.0.0</p>
    </div>
  );
}

function mapState(state) {
  const { loggedIn } = state.authentication;
  return { loggedIn };
}

const actionCreators = {
  login: userActions.login,
  logout: userActions.logout,
};

const connectedLogin = connect(mapState, actionCreators)(Login);

export { connectedLogin as Login };
