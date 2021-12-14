import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "antd";
import { connect, useSelector } from "react-redux";
import { adminNav, sellerNav, buyerNav } from "../../navigations";
import { Icon } from "..";
import { NavLink } from "react-router-dom";

function VerticalMenu() {
  let location = useLocation();
  const [mainNavs, setMainNavs] = useState([]);
  const userData = useSelector((state) => state.authentication.user);
  const loggingIn = useSelector((state) => state.authentication.loggingIn);

  const getNavLinkClass = (path) => {
    return location.pathname === path ? "mm-active" : "";
  };

  useEffect(() => {
    let navs = [];
    console.log("userData" + userData);
    if (loggingIn) {
      const userRoles = userData.role;

      if (userRoles == "SELLER") {
        navs.push(...sellerNav);
      } else if (userRoles == "BUYER") {
        navs.push(...buyerNav);
      } else if (userRoles == "ADMIN") {
        navs.push(...adminNav);
      }

      setMainNavs(
        Array.from(new Set(navs.map((item) => item.path))).map((path) => {
          return {
            icon: navs.find((s) => s.path === path).icon,
            label: navs.find((s) => s.path === path).label,
            path: navs.find((s) => s.path === path).path,
          };
        })
      );
    }
  }, [userData]);

  return (
    <div>
      <Menu mode="inline" style={{ paddingTop: 10 }}>
        {mainNavs.map((nav) => {
          return (
            <Menu.Item key={nav.path} className={getNavLinkClass(nav.path)}>
              <NavLink to={nav.path}>
                <div className="d-inline-block icons-sm mr-1">
                  <Icon name={nav.icon} />
                </div>
                <span>{nav.label}</span>
              </NavLink>
            </Menu.Item>
          );
        })}
      </Menu>
    </div>
  );
}

const mapState = function (state) {
  const { authentication } = state;
  return {
    user: authentication,
  };
};

const connectedVerticalMenu = connect(mapState)(VerticalMenu);
export { connectedVerticalMenu as VerticalMenu };
