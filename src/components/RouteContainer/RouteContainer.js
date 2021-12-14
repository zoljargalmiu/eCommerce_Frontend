import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { Layout } from "antd";
import { PrivateRoute, VerticalMenu } from "../";
// import logo_new from "../../assets/images/logo_new.png";
// import logo from "../../assets/images/logo.png";
import logo_new from "../../assets/images/pngegg.png";
import logo from "../../assets/images/pngegg.png";
import { connect, useSelector } from "react-redux";
import { adminRoutes, ownerRoutes, playerRoutes } from "../../routes";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";

const { Content, Footer, Sider } = Layout;
const RouteContainer = ({ user, ...rest }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mainRouters, setMainRouters] = useState([]);
  const userData = useSelector((state) => state.authentication.user);
  const loggingIn = useSelector((state) => state.authentication.loggingIn);

  useEffect(() => {
    let routes = [];
    if (loggingIn) {
      // const userRoles = userData.roles;
      const userRoles = userData.role;
      // userRoles.map((role) => {
      console.log("userRole: " + userRoles);
      switch (userRoles) {
        case "CLUBOWNER":
          routes.push(...ownerRoutes);
        // return;
        case "PLAYER":
          routes.push(...playerRoutes);
        // return;
        case "ADMIN":
          routes.push(...adminRoutes);
        // return;
        default:
        // return;
      }
      // });
    }

    setMainRouters(routes);
  }, []);

  return (
    <Route
      {...rest}
      render={(props) =>
        user.loggingIn ? (
          <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsed={collapsed} width={200}>
              <a href="/" className="logo">
                <span className="logo-sm">
                  {!collapsed && <img src={logo_new} height={55} />}
                  {collapsed && <img src={logo} height={55} />}
                </span>
                <span className="logo-lg">
                  {!collapsed && <img src={logo_new} height={55} />}
                  {collapsed && <img src={logo} height={55} />}
                </span>
              </a>
              <VerticalMenu />
              <div className="dropdown-divider"></div>
              <div className="collapse-logo">
                <button
                  type="button"
                  className="btn btn-sm px-3 font-size-24 header-item waves-effect"
                  style={{ paddingBottom: 27 }}
                  id="vertical-menu-btn"
                  onClick={() => setCollapsed(!collapsed)}
                >
                  {!collapsed && (
                    <LeftCircleOutlined
                      style={{
                        fontSize: "30px",
                        color: "#4c4e57",
                      }}
                    />
                  )}
                  {collapsed && (
                    <RightCircleOutlined
                      style={{
                        fontSize: "30px",
                        color: "#4c4e57",
                      }}
                    />
                  )}
                </button>
              </div>
            </Sider>
            <Layout className="site-layout">
              <Content>
                {mainRouters.map((item) => (
                  <PrivateRoute
                    key={item.path}
                    path={item.path}
                    component={item.component}
                    showHeader={item.showHeader}
                    exact={item.exact}
                  />
                ))}
              </Content>
              <Footer style={{ textAlign: "center" }}>eCommerce ©2021</Footer>
            </Layout>
          </Layout>
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

const connectedRouteContainer = connect(mapState, null)(RouteContainer);
export { connectedRouteContainer as RouteContainer };
