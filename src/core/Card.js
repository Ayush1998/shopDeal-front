import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import moment from "moment";
import { isAuthenticated } from "../auth/index";
import { addItem, updateItem, removeItem } from "./cartHelpers";

const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  width,
  loadItems,
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);
  const [error, setError] = useState(false);

  const { user, token } = isAuthenticated();

  const showViewButton = (showViewProductButton) => {
    return (
      showViewProductButton && (
        <Link to={`/product/${product._id}`} className="mr-2">
          <button className="btn btn-outline-primary mr-2 mt-2  mb-2">
            View Product
          </button>
        </Link>
      )
    );
  };

  const showAddToCart = (showAddToCartButton) => {
    return (
      showAddToCartButton && (
        <button
          onClick={addToCart}
          className="btn btn-outline-warning ml-2 mt-2 mb-2 "
        >
          Add to cart
        </button>
      )
    );
  };

  const addToCart = () => {
    addItem(product, user._id, token).then((data) => {
      if (data.error) {
        setError(data.error);
      }

      setRedirect(true);
    });
  };

  const removeFromCart = () => {
    removeItem(user._id, token, product._id, loadItems).then((data) => {
      if (data.error) {
        setError(data.error);
      }
    });
  };

  const showRemoveButton = (showRemoveProductButton) => {
    return (
      showRemoveProductButton && (
        <button
          onClick={removeFromCart}
          className="btn btn-outline-danger ml-2 mt-2 mb-2"
        >
          Remove Product
        </button>
      )
    );
  };

  const shouldRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const showStock = (quantity) => {
    return quantity > 0 ? (
      <div className=" text-center">
        <span className="badge badge-primary badge-pill text-center ">
          In Stock
        </span>
      </div>
    ) : (
      <div className=" text-center">
        <span className="badge badge-primary badge-pill text-center">
          Out of Stock
        </span>
      </div>
    );
  };

  const handleChange = (productId) => (event) => {
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(
        user._id,
        token,
        productId,
        event.target.value,
        loadItems
      ).then((data) => {
        if (data.error) {
          console.log(error);
        }
      });
    }
  };

  const showCartUpdateOptions = (cartUpdate) => {
    return (
      cartUpdate && (
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Adjust Quantity</span>
          </div>

          <input
            type="number"
            className="form-control"
            value={count}
            onChange={handleChange(product._id)}
          ></input>
        </div>
      )
    );
  };

  return (
    <div className="card">
      <div className="card-header name">{product.name}</div>
      <div className="card-body">
        {shouldRedirect(redirect)}

        <ShowImage item={product} url="product" />
        <p className="lead mt-2 text-center">
          {product.description.substring(0, 100)}
        </p>
        <p className="black-10 text-center">${product.price}</p>
        <p className="black-9 text-center">
          Category: {product.category && product.category.name}
        </p>

        <p className="black-8 text-center">
          Added on {moment(product.createdAt).fromNow()}
        </p>

        {showStock(product.quantity)}
        <br />
      </div>

      <div className="card-footer">
        {showViewButton(showViewProductButton)}

        {showAddToCart(showAddToCartButton)}

        {showRemoveButton(showRemoveProductButton)}

        {showCartUpdateOptions(cartUpdate)}
      </div>
    </div>
  );
};

export default Card;
