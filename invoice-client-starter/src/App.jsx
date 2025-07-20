import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faFileInvoice, faChartBar } from "@fortawesome/free-solid-svg-icons";
import "./css/Navbar.css";
import { NavLink } from "react-router-dom";

import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";

import PersonIndex from "./persons/PersonIndex";
import PersonDetail from "./persons/PersonDetail";
import PersonForm from "./persons/PersonForm";

import InvoiceIndex from "./invoices/InvoiceIndex";
import InvoiceForm from "./invoices/InvoiceForm";
import InvoiceDetail from "./invoices/InvoiceDetail";

import StatisticsPage from "./statistics/StatisticsPage";

// ===== Finální, správná verze pro index.jsx =====

export function App() {
  return (
    <Router>
      {/* Hlavní obal s flexboxem */}
      <div className="page-container">
        
        {/* Hlavní obsah, který se roztáhne a odtlačí patičku */}
        <main className="main-content">
               
          <nav>
     <input type="checkbox" id="menu-toggle" className="menu-toggle" />
<label htmlFor="menu-toggle" className="hamburger">&#9776;</label>
            <ul className="navbar-nav ">
              <li className="nav-item">
               <NavLink to="/persons" className={({ isActive }) =>
    isActive ? "nav-item nav-link persons-link active" : "nav-item nav-link persons-link"
}>
 
    <FontAwesomeIcon className="link-icon link-icon-person fas fa-users" icon={faUsers} /> <span className=" nav-text nav-text-person ">Seznam osob</span>
</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/invoices" className={({ isActive }) =>
    isActive ? "nav-item nav-link persons-link active" : "nav-item nav-link invoices-link"
}> <div className="indicator"></div>
                  <FontAwesomeIcon className="link-icon link-icon-invoice fas fa-file-invoice" icon={faFileInvoice} /><span className=" nav-text nav-text-invoice ">Seznam Faktur</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/statistics" className={({ isActive }) =>
    isActive ? "nav-item nav-link persons-link active" : "nav-item nav-link statistics-link"
}>
                  <FontAwesomeIcon className="link-icon link-icon-statistics fas fa-chart-bar" icon={faChartBar} /> <span className="  nav-text nav-text-statistics ">Statistiky</span>
                </NavLink>
              </li>
            </ul>
          </nav>
       
          <Routes>
            {/* ... všechny vaše routes ... */}
            <Route index element={<Navigate to="/persons" />} />
            <Route path="/persons" element={<Outlet />}>
              <Route index element={<PersonIndex />} />
              <Route path="show/:id" element={<PersonDetail />} />
              <Route path="create" element={<PersonForm />} />
              <Route path="edit/:id" element={<PersonForm />} />
            </Route>
            <Route path="/invoices" element={<Outlet />}>
              <Route index element={<InvoiceIndex />} />
              <Route path="create" element={<InvoiceForm />} />
              <Route path="show/:id" element={<InvoiceDetail />} />
              <Route path="edit/:id" element={<InvoiceForm />} />
            </Route>
            <Route path="/statistics" element={<StatisticsPage />} /> 
          </Routes>
        </main>

        {/* Patička je na konci a přirozeně odtlačena obsahem */}
        <footer className="my-footer">
          ItnetworkProject © František Martinec
        </footer>
        
      </div>
    </Router>
  );
}

export default App;