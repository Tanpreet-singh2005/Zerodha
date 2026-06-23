import React from 'react'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
function Hero() {
  return (  
    <div className='container '>
      <div className='row text-center'>
        <img src='media/images/homeHero.png' alt='Hero_image' className='mb-3'/>
        <h1 className='mt-5'>Invest in everything</h1>
        <p>Online platform to invest in stocks, derivatives, mutual funds and more</p>
        
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

export default Hero;