import { API } from "../config";

export const addItem = (item, userId, token, next) => {
  item["count"] = 1;

  return fetch(`${API}/user/addToCart/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ item }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });

  // let cart = [];
  // if (typeof window != "undefined") {
  //   if (localStorage.getItem("cart")) {
  //     cart = JSON.parse(localStorage.getItem("cart"));
  //   }
  //   cart.push({ ...item, count: 1 });

  //   cart = Array.from(new Set(cart.map((p) => p._id))).map((id) => {
  //     return cart.find((p) => p._id === id);
  //   });

  //   localStorage.setItem("cart", JSON.stringify(cart));
  //   next();
  // }
};

export const itemTotal = (userId, token) => {
  return fetch(`${API}/user/totalItems/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
  // if (typeof window !== "undefined") {
  //   if (localStorage.getItem("cart")) {
  //     return JSON.parse(localStorage.getItem("cart")).length;
  //   }
  // }
  // return 0;
};

export const getCart = (userId, token) => {
  return fetch(`${API}/user/getCartItems/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const updateItem = (userId, token, productId, count, next) => {
  const update = { productId, count };
  return fetch(`${API}/user/updateCount/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(update),
  })
    .then((response) => {
      next();
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const removeItem = (userId, token, productId, next) => {
  return fetch(`${API}/user/removeItem/${userId}/${productId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      next();
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const emptyCart = (userId, token, next) => {
  return fetch(`${API}/user/removeAll/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      next();
    })
    .catch((err) => {
      console.log(err);
    });
};
