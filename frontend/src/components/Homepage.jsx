import React from "react";
import Navbar from "./Navbar";
import Navbar2 from "./Navbar2";
import { Outlet } from "react-router";
import { useAuth } from "./AuthController";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Homepage() {
  const { verifyToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { loggedIn, status } = await verifyToken();
      if (!loggedIn) {
        navigate("/login");
      } else {
        switch (status) {
          case 200:
            navigate("/");
            break;
          case 201:
            navigate("/checkout");
            break;
          default:
            navigate("/login"); // Fallback if an unexpected status code is received
        }
      }
    };
    checkAuth();
  }, [navigate, verifyToken]);

  return (
    <div>
      <div className='App container-fluid row'>
        <div className='col-lg-2'>
          <Navbar2 />
        </div>
        <div className='col-lg-10 col-md-12'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
