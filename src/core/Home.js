import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Card from "./Card";
import Search from "./Search";

const Home = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState(false);

  const loadProductsBySell = () => {
    getProducts("sold").then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsBySell(data);
      }
    });
  };

  const loadProductsByArrival = () => {
    getProducts("createdAt").then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsByArrival(data);
      }
    });
  };

  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
  }, []);

  return (
    <Layout
      title="Home Page"
      description="ShopDeal - An Online Book Store"
      className="container-fluid"
    >
      <Search />
      <section className="products" id="productsdiv">
        <div className="container headings text-center">
          <h2 className="mb-4">Newly Added</h2>
        </div>
        <div className="container">
          <div className="row">
            {productsByArrival.map((product, i) => (
              <div key={i} className="col-lg-4 col-12 mb-3">
                <Card product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="products" id="productsdiv">
        <div className="container headings text-center">
          <h2 className="mb-4">Most Selling</h2>
        </div>
        <div className="container">
          <div className="row">
            {productsBySell.map((product, i) => (
              <div key={i} className="col-lg-4 col-sm-12 mb-3">
                <Card product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
