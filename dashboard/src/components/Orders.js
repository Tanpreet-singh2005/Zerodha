import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import GeneralContext from "./GeneralContext";
import { API_URL } from "../config";

function Orders() {
  const [allOrders, setAllOrders] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const generalContext = useContext(GeneralContext);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/orders`, { withCredentials: true })
      .then((res) => {
        setAllOrders(res.data);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
      });

    axios
      .get(`${API_URL}/api/holdings`, { withCredentials: true })
      .then((res) => {
        setHoldings(res.data);
      })
      .catch((err) => {
        console.error("Error fetching holdings:", err);
      });
  }, []);

  // Check if user currently holds a stock (to show sell button)
  const getHolding = (stockName) => {
    return holdings.find((h) => h.name === stockName);
  };

  if (allOrders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Orders ({allOrders.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Mode</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order, index) => {
              const modeClass = order.mode === "BUY" ? "profit" : "loss";
              const holding = getHolding(order.name);
              return (
                <tr key={index}>
                  <td>{order.name}</td>
                  <td>{order.qty}</td>
                  <td>{order.price.toFixed(2)}</td>
                  <td className={modeClass}>{order.mode}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td>
                    {holding && (
                      <button
                        className="order-sell-btn"
                        onClick={() =>
                          generalContext.openSellWindow(order.name)
                        }
                      >
                        Sell ({holding.qty})
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Orders;