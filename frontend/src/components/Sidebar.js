import React, { useState } from "react";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const [isCategoriesOpen, setCategoriesOpen] = useState(false);
  const [isOrdersOpen, setOrdersOpen] = useState(false);

  const toggleCategories = () => {
    setCategoriesOpen(!isCategoriesOpen);
    setOrdersOpen(false); // Close orders when categories are opened
  };

  const toggleOrders = () => {
    setOrdersOpen(!isOrdersOpen);
    setCategoriesOpen(false); // Close categories when orders are opened
  };

  const handleLogout = () => {
    // Implement your logout logic here
    alert("Logout button clicked!");
  };

  return (
    <div>
      <nav className="sidebar">
        <div>NextSkills360</div>
        <div className="text">NextSkills360</div>
        <ul>
          <li>
            <a href="/admin">Dashboard</a>
          </li>
          <li>
            <a
              href="#"
              onClick={toggleCategories}
              className={isCategoriesOpen ? "open" : ""}
            >
              Categories{" "}
              <span>
                <FontAwesomeIcon icon={faCaretDown} />
              </span>
            </a>
            {isCategoriesOpen && (
              <ul className="sub-menu">
                <li>
                  <a href="/category">Add Categories</a>
                </li>
              </ul>
            )}
          </li>
          <li>
            <a href="/products">Products</a>
          </li>
          <li>
            <a
              href="#"
              onClick={toggleOrders}
              className={isOrdersOpen ? "open" : ""}
            >
              Orders{" "}
              <span>
                <FontAwesomeIcon icon={faCaretDown} />
              </span>
            </a>
            {isOrdersOpen && (
              <ul className="sub-menu">
                <li>
                  <a href="/orders">View Orders</a>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
