import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './landing_page/home/HomePage';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Signup from './landing_page/signup/Signup';
import About from './landing_page/about/AboutPage';
import Product from './landing_page/products/ProductPage'
import Pricing from './landing_page/pricing/PricingPage'
import Support from './landing_page/support/SupportPage'
import Footer from './landing_page/Footer';
import NotFound from './landing_page/NotFound';
import Navbar from './landing_page/Navbar';
import ReactDom from 'react-dom/client';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './landing_page/login/Login';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Navbar/>
  <Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="/product" element={<Product/>}/>
    <Route path="/pricing" element={<Pricing/>}/>
    <Route path="/support" element={<Support/>}/>
     <Route path="*" element={<NotFound/>}/>

  </Routes>
  <Footer/>
  </BrowserRouter>
);
