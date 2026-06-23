import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function Funds() {
  const [fundsData, setFundsData] = useState(null);
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const fetchFunds = () => {
    axios
      .get(`${API_URL}/api/funds`, { withCredentials: true })
      .then((res) => {
        setFundsData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching funds:", err);
      });
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleAddFunds = () => {
    if (!addAmount || Number(addAmount) <= 0) {
      showMessage("Enter a valid amount", "error");
      return;
    }
    axios
      .post(
        `${API_URL}/api/funds/add`,
        { amount: addAmount },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.success) {
          showMessage(res.data.message, "success");
          setAddAmount("");
          setShowAddModal(false);
          fetchFunds();
        } else {
          showMessage(res.data.message, "error");
        }
      })
      .catch((err) => {
        showMessage(err.response?.data?.message || "Failed to add funds", "error");
      });
  };

  const handleWithdrawFunds = () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      showMessage("Enter a valid amount", "error");
      return;
    }
    axios
      .post(
        `${API_URL}/api/funds/withdraw`,
        { amount: withdrawAmount },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.success) {
          showMessage(res.data.message, "success");
          setWithdrawAmount("");
          setShowWithdrawModal(false);
          fetchFunds();
        } else {
          showMessage(res.data.message, "error");
        }
      })
      .catch((err) => {
        showMessage(
          err.response?.data?.message || "Failed to withdraw funds",
          "error"
        );
      });
  };

  const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (!fundsData) {
    return <div className="funds-loading">Loading funds...</div>;
  }

  return (
    <>
      {message && (
        <div className={`funds-message ${messageType}`}>{message}</div>
      )}

      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI</p>
        <button
          className="btn btn-green"
          onClick={() => {
            setShowAddModal(true);
            setShowWithdrawModal(false);
          }}
        >
          Add funds
        </button>
        <button
          className="btn btn-blue"
          onClick={() => {
            setShowWithdrawModal(true);
            setShowAddModal(false);
          }}
        >
          Withdraw
        </button>
      </div>

      {showAddModal && (
        <div className="funds-modal">
          <div className="funds-modal-content">
            <h4>Add Funds</h4>
            <p className="funds-modal-subtitle">
              Enter the amount you want to add to your account
            </p>
            <div className="funds-input-group">
              <span className="currency-symbol">₹</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                autoFocus
              />
            </div>
            <div className="funds-quick-amounts">
              {[1000, 5000, 10000, 25000, 50000].map((amt) => (
                <button
                  key={amt}
                  className="quick-amount-btn"
                  onClick={() => setAddAmount(amt.toString())}
                >
                  ₹{amt.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
            <div className="funds-modal-actions">
              <button className="btn btn-green" onClick={handleAddFunds}>
                Add ₹{addAmount ? formatCurrency(addAmount) : "0.00"}
              </button>
              <button
                className="btn btn-grey"
                onClick={() => {
                  setShowAddModal(false);
                  setAddAmount("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showWithdrawModal && (
        <div className="funds-modal">
          <div className="funds-modal-content">
            <h4>Withdraw Funds</h4>
            <p className="funds-modal-subtitle">
              Available balance: ₹{formatCurrency(fundsData.balance)}
            </p>
            <div className="funds-input-group">
              <span className="currency-symbol">₹</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                autoFocus
              />
            </div>
            <div className="funds-quick-amounts">
              <button
                className="quick-amount-btn"
                onClick={() =>
                  setWithdrawAmount(fundsData.balance.toString())
                }
              >
                Withdraw All
              </button>
            </div>
            <div className="funds-modal-actions">
              <button className="btn btn-orange-fund" onClick={handleWithdrawFunds}>
                Withdraw ₹
                {withdrawAmount ? formatCurrency(withdrawAmount) : "0.00"}
              </button>
              <button
                className="btn btn-grey"
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">{formatCurrency(fundsData.availableMargin)}</p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">{formatCurrency(fundsData.usedMargin)}</p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">{formatCurrency(fundsData.availableCash)}</p>
            </div>
            <hr />
            <div className="data">
              <p>Opening Balance</p>
              <p>{formatCurrency(fundsData.openingBalance)}</p>
            </div>
            <div className="data">
              <p>Payin</p>
              <p>{formatCurrency(fundsData.payin)}</p>
            </div>
            <div className="data">
              <p>Payout</p>
              <p>{formatCurrency(fundsData.payout)}</p>
            </div>
            <div className="data">
              <p>SPAN</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Delivery margin</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Exposure</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>0.00</p>
            </div>
            <hr />
            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Collateral (Equity)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Total Collateral</p>
              <p>0.00</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>You don't have a commodity account</p>
            <button className="btn btn-blue">Open Account</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Funds;