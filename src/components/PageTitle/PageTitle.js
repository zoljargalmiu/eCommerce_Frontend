import React, { useState, useEffect } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import Avatar from "../../assets/images/avatar-1.jpg";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";

function PageTitle({ user, title = "", description = "", right = null }) {
  const [isOpen, setIsOpen] = useState(false);

  const userData = useSelector((state) => state.authentication.user);

  return (
    <>
      <div className="page-title-box">
        <div className="row" style={{ margin: 0 }}>
          <div
            className="col-md-9"
            style={{ textAlign: "center", paddingTop: 25, paddingLeft: 150 }}
          >
            <h4 className="page-title mb-1">{title}</h4>
          </div>
          <div
            className="col-md-3"
            style={{ textAlign: "end", paddingLeft: 5 }}
          >
            <div className="dropdown d-inline-block">
              <OutsideClickHandler
                onOutsideClick={() => (isOpen ? setIsOpen(false) : null)}
              >
                <button
                  type="button"
                  className="btn header-item waves-effect"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <img
                    className="rounded-circle header-profile-user"
                    src={Avatar}
                    alt="Header Avatar"
                  />
                  <span
                    className="d-none d-sm-inline-block ml-1"
                    style={{ color: "white", paddingLeft: 8 }}
                  >
                    {userData ? userData.name : ""}
                  </span>
                </button>
              </OutsideClickHandler>
              <div
                className={`dropdown-menu dropdown-menu-right ${
                  isOpen ? "show" : ""
                }`}
              >
                <Link
                  className="dropdown-item"
                  to="/login"
                  style={{ width: 230, color: "red" }}
                >
                  <i className="mdi mdi-logout font-size-16 align-middle mr-1"></i>
                  Sign Out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const mapState = function (state) {
  const { authentication } = state;
  return {
    user: authentication,
  };
};

const connectedPageTitle = connect(mapState)(PageTitle);
export { connectedPageTitle as PageTitle };
