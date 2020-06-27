import React from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const {
    user: { _id, name, email, role },
  } = isAuthenticated();

  const adminLinks = () => {
    return (
      <div className="card link">
        <h4 className="card-header">Admin Links</h4>
        <ul className="list-group admin-links">
          <li className="list-group-item ">
            <Link
              className="nav-link btn-outline-primary"
              to="/create/category"
            >
              Create Category
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link btn-outline-primary" to="/create/product">
              Create Product
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link btn-outline-primary" to="/admin/orders">
              View Orders
            </Link>
          </li>
          <li className="list-group-item ">
            <Link className="nav-link btn-outline-primary" to="/admin/products">
              Manage products
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const adminInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">User Information</h3>
        <ul className="card-body list-group">
          <li className="list-group-item text-center font-weight-bold">
            {name}
          </li>
          <li className="list-group-item text-center font-weight-bold">
            {email}
          </li>
          <li className="list-group-item text-center font-weight-bold">
            {role === 1 ? "Admin" : "Registered User"}
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Layout
      title="Dashboard"
      description={`G'day ${name}!`}
      className="container-fluid"
    >
      <div className="row">
        <div className="col-5">{adminLinks()}</div>
        <div className="col-7">{adminInfo()}</div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
