import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getCart } from "./cartHelpers";
import { isAuthenticated } from "../auth/index";
import Card from "./Card";
import { Link } from "react-router-dom";
import Checkout from "./Checkout";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState();

  const { user, token } = isAuthenticated();

  const loadItems = () => {
    getCart(user._id, token).then((data) => {
      if (data.error) {
        setError(data.error);
      }
      setCartItems(data);
    });
  };

  useEffect(() => {
    loadItems();
  }, []);

  const showItems = (cartItems) => {
    return (
      <div>
        <h2>Your cart has {`${cartItems.length}`} items</h2>
        <hr />
        {cartItems.map((p, i) => (
          <Card
            key={i}
            product={p.item}
            showAddToCartButton={false}
            cartUpdate={true}
            showRemoveProductButton={true}
            loadItems={loadItems}
          />
        ))}
      </div>
    );
  };

  const noItemMessage = () => (
    <h2>
      {" "}
      Your cart is empty. <br /> <Link to="/shop">Continue shopping</Link>
    </h2>
  );

  return (
    <Layout
      title="Shopping Cart"
      description="Manage your cart items"
      className="container-fluid"
      total={cartItems.length}
    >
      <div className="container">
        <div className="row">
          <div className="col-6">
            {cartItems.length > 0 ? showItems(cartItems) : noItemMessage()}
          </div>

          <div className="col-6">
            <h2 className="mb-4">Your cart summary</h2>
            <hr />
            <Checkout products={cartItems} loadItems={loadItems} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
