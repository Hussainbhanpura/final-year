import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import BASE_URL from "../config.js";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password);
    const userDetails = { username, password };
    try {
      const res = await axios.post(`${BASE_URL}/api/register`, userDetails);
      console.log(res.data); // handle successful registration
      navigate("/login"); // Redirect to login page after registration
    } catch (e) {
      window.alert("Error in registration");
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-2 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card text-dark" style={{ borderRadius: "1rem" }}>
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Register</h2>
                  <p className="text-dark-50 mb-5">
                    Please enter your desired username and password!
                  </p>
                  <div
                    data-mdb-input-init
                    className="form-outline form-dark mb-4"
                  >
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      type="text"
                      id="typeUsername"
                      className="form-control form-control-lg"
                    />
                    <label className="form-label" htmlFor="typeUsername">
                      Username
                    </label>
                  </div>
                  <div
                    data-mdb-input-init
                    className="form-outline form-dark mb-4"
                  >
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      id="typePassword"
                      className="form-control form-control-lg"
                    />
                    <label className="form-label" htmlFor="typePassword">
                      Password
                    </label>
                  </div>
                  <button
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-lg px-5"
                    type="submit"
                    onClick={onSubmit}
                  >
                    Register
                  </button>
                </div>
                <div>
                  <p className="mb-0">
                    Already have an account?{" "}
                    <a href="/login" className="text-grey-50 fw-bold">
                      Login
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
