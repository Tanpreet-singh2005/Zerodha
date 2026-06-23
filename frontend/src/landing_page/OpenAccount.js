import React from 'react'
import {Link} from 'react-router-dom';

function OpenAccount() {
  return (
    <div className='container p-5'>
      <div className='row text-center'>
        
        <h1 className="mt-5">Open a Zerodha account</h1>
        <p>
          Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and
          F&O trades.
        </p>
        <Link
          className="btn btn-primary px-4 mb-5"
          style={{ width: "15%", margin: "0 auto" }}
          to="/signup"
        >
          Sign Up
        </Link>
      </div>

    </div>
    );
}

export default OpenAccount;