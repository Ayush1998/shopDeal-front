import React, { Fragment, useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};

const Menu = ({ history, total = null }) => {
  const [totalItem, setTotalItem] = useState();

  const [error, setError] = useState(false);

  const { user, token } = isAuthenticated();

  const loadTotalItems = () => {
    itemTotal(user._id, token).then((data) => {
      if (data.error) {
        setError(data.error);
      }
      setTotalItem(data);
    });
  };

  useEffect(() => {
    if (localStorage.getItem("jwt") !== null) {
      loadTotalItems();
    }
  }, []);

  return (
    <>
      <nav class="navbar navbar-expand-lg">
        <div className=" container p-2">
          <Link class="navbar-brand font-weight-bold text-white" to="/">
            BuyBooks
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon">
              <i
                class="fas fa-bars"
                style={{ color: "#fff", "font-size": "28px" }}
              ></i>
            </span>
          </button>

          <div
            class="collapse navbar-collapse ml-5 mr-5"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav ml-auto ">
              <li className="nav-item ">
                <Link
                  className="nav-link"
                  style={isActive(history, "/")}
                  to="/"
                >
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  style={isActive(history, "/shop")}
                  to="/shop"
                >
                  Shop
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  style={isActive(history, "/cart")}
                  to="/cart"
                >
                  Cart{" "}
                  <sup>
                    <small className="cart-badge">
                      {total !== null ? total : totalItem}
                    </small>
                  </sup>
                </Link>
              </li>

              {isAuthenticated() && isAuthenticated().user.role === 0 && (
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    style={isActive(history, "/user/dashboard")}
                    to="/user/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
              )}

              {isAuthenticated() && isAuthenticated().user.role === 1 && (
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    style={isActive(history, "/admin/dashboard")}
                    to="/admin/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
              )}

              {!isAuthenticated() && (
                <Fragment>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      style={isActive(history, "/signin")}
                      to="/signin"
                    >
                      Signin
                      <i class="fas fa-sign-in-alt ml-2"></i>{" "}
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      style={isActive(history, "/signup")}
                      to="/signup"
                    >
                      Signup
                      <i class="fas fa-user-plus ml-2"></i>
                    </Link>
                  </li>
                </Fragment>
              )}

              {isAuthenticated() && (
                <li className="nav-item">
                  <span
                    className="nav-link"
                    style={{ cursor: "pointer", color: "#ffffff" }}
                    onClick={() =>
                      signout(() => {
                        history.push("/");
                      })
                    }
                  >
                    Signout
                    <i className="fas fa-sign-out-alt ml-2"></i>
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default withRouter(Menu);
