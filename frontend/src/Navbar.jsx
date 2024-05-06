import React from "react";

function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Navbar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <div className="first-nav">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">
                    Library
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">
                    Add Item
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">
                    Add Collection
                  </a>
                </li>
              </div>
              <div className="second-nav">
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Lending
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Managers
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Barcode
                  </a>
                </li>
              </div>
              <div className="third-nav">
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Reports
                  </a>
                </li>
              </div>
              <div className="forth-nav">
                <li className="nav-item">
                  <a className="nav-link" aria-disabled="true">
                    Setting
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" aria-disabled="true">
                    Support
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" aria-disabled="true">
                    Logout
                  </a>
                </li>
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
