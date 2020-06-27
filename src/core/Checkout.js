import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getBraintreeToken, processPayment, createOrder } from "./apiCore";
import { emptyCart } from "./cartHelpers";
import Card from "./Card";
import { isAuthenticated } from "../auth";
import "braintree-web";
import DropIn from "braintree-web-drop-in-react";
import { Link } from "react-router-dom";

const Checkout = ({ products, loadItems }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: "",
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getBraintreeToken(userId, token).then((data) => {
      if (data.error) {
        setData({ ...data, error: data.error });
      } else {
        setData({ clientToken: data.clientToken });
      }
    });
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div> {showDropIn()} </div>
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary"> Sign In to Checkout </button>
      </Link>
    );
  };

  const getTotal = () => {
    return products.reduce((currValue, nextValue) => {
      return currValue + nextValue.item.price * nextValue.item.count;
    }, 0);
  };

  let delAddress = data.address;
  const buy = () => {
    setData({ loading: true });
    let nonce;
    let getNonce = data.instance
      .requestPaymentMethod()
      .then((data) => {
        nonce = data.nonce;
        const paymentData = {
          paymentMethod: nonce,
          amount: getTotal(),
        };

        processPayment(userId, token, paymentData)
          .then((response) => {
            const createOrderData = {
              products: products,
              transaction_id: response.transaction.id,
              amount: response.transaction.amount,
              address: delAddress,
            };

            createOrder(userId, token, createOrderData)
              .then((response) => {
                setData({ ...data, success: response.success });

                //empty cart
                emptyCart(userId, token, loadItems, () => {
                  setData({ loading: false });
                });
              })
              .catch((error) => {
                console.log(error);
                setData({ loading: false });
              });
          })
          .catch((error) => {
            console.log(error);
            setData({ loading: false });
          });
      })
      .catch((error) => {
        console.log("dropin error: ", error);
        setData({ ...data, error: error.message });
      });
  };

  const showLoading = (loading) => loading && <h2>Loading... </h2>;

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: "" })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <div className="form-group mb-3">
            <label className="text-muted">Delivery Address</label>
            <textarea
              onChange={handleAddress}
              className="form-control"
              value={data.address}
              placeholder="Type your address"
            />
          </div>
          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: "vault",
              },
            }}
            onInstance={(instance) => {
              data.instance = instance;
            }}
          />
          <button onClick={buy} className="btn btn-success btn-block">
            {" "}
            Pay
          </button>
        </div>
      ) : null}
    </div>
  );

  const handleAddress = (event) => {
    setData({ ...data, address: event.target.value });
  };

  const showError = (error) => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = (success) => (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      Thanks your payment was successful
    </div>
  );

  return (
    <div>
      <h2>Total: ${getTotal()}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {showError(data.error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
