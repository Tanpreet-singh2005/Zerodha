import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL, FRONTEND_URL } from "../config";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const [cookies, removeCookie] = useCookies(["token"]);
  const [username, setUsername] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        window.location.href = `${FRONTEND_URL}/login`;
        return;
      }
      try {
        const { data } = await axios.post(
          `${API_URL}/`,
          {},
          { withCredentials: true }
        );
        const { status, user } = data;
        
        if (status) {
          setUsername(user);
          setIsVerified(true);
          toast.success(`Hello ${user}`, { position: "top-right" });
        } else {
          removeCookie("token", { path: '/' });
          window.location.href = `${FRONTEND_URL}/login`;
        }
      } catch (error) {
        console.error(error);
        removeCookie("token", { path: '/' });
        window.location.href = `${FRONTEND_URL}/login`;
      }
    };
    verifyCookie();
  }, [cookies, removeCookie]);

  const handleLogout = () => {
    removeCookie("token", { path: '/' });
    window.location.href = `${FRONTEND_URL}/login`;
  };

  if (!isVerified) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><h2>Loading...</h2></div>;
  }

  return (
    <>
      <TopBar username={username} onLogout={handleLogout} />
      <Dashboard />
      <ToastContainer />
    </>
  );
};

export default Home;