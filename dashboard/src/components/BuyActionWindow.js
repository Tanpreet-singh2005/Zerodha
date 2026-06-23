import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import { API_URL } from "../config";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, mode = "BUY" }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const generalContext = useContext(GeneralContext);

  const isBuy = mode === "BUY";

  const handleActionClick = () => {
    axios
      .post(
        `${API_URL}/api/orders`,
        {
          name: uid,
          qty: stockQuantity,
          price: stockPrice,
          mode: mode,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.success) {
          generalContext.closeBuyWindow();
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Order failed";
        alert(msg);
      });
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{(stockQuantity * stockPrice).toFixed(2)}</span>
        <div>
          <Link
            className={isBuy ? "btn btn-blue" : "btn btn-orange"}
            onClick={handleActionClick}
          >
            {isBuy ? "Buy" : "Sell"}
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;