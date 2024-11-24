import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./components/Home"; // Your Home component
import List from "./components/List"; // Your List component
import CompanyDetail from "./components/CompanyDetail"; // The new Company Detail page
import "./index.css";

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home page */}
          <Route path="/list" element={<List />} /> {/* Company list page */}
          <Route path="/company/:companyId" element={<CompanyDetail />} />{" "}
          {/* Company details page */}
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
