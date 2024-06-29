import React from "react";
import Navbar2 from "./Navbar2";
import { Outlet, useLocation } from "react-router";
import { useAuth } from "./AuthController";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Homepage() {
  const { verifyToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to access the current URL path

  useEffect(() => {
    const checkAuth = async () => {
      const { loggedIn, status } = await verifyToken();
      if (!loggedIn) {
        navigate("/login");
      } else {
        switch (status) {
          case 200:
            if (location.pathname === "/login") {
              navigate("/");
            }
            break;
          case 201:
            if (location.pathname !== "/checkout") {
              navigate("/checkout");
            }
            break;
          default:
            navigate("/login");
        }
      }
    };
    checkAuth();
  }, [navigate, verifyToken, location.pathname]);

  return (
    <div>
      <div className='App container-fluid row'>
        {location.pathname !== "/checkout" && (
          <div className='col-lg-2'>
            <Navbar2 />
          </div>
        )}
        <div className='col-lg-10 col-md-12'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
