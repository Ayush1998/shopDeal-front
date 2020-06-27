import React from "react";
import Menu from "./Menu";
import "../styles.css";

const Layout = ({
  title = "Title",
  description = "Description",
  className,
  children,
  total,
}) => (
  <div>
    <div className="header" id="topheader">
      <Menu total={total} />
      <div className="header-section">
        <div className="center-div">
          <h2 className="font-weight-bold">{title}</h2>
          <p className="lead">{description}</p>
        </div>
      </div>
    </div>

    <div className={className}>{children}</div>
  </div>
);

export default Layout;
