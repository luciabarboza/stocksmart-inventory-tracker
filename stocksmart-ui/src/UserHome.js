import React from "react";
import "./UserHome.css";
import InventoryManager from "./InventoryManager";
import ExpirationAlerts from "./ExpirationAlerts"; // Import ExpirationAlerts

const UserHome = ({ user }) => {
  // Get the current hour to determine the greeting
  const currentHour = new Date().getHours();
  let greeting;

  if (currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  return (
    <div className="food-items-page">
      {/* Notification Bell in Top Right */}
      <div className="alerts-icon">
        <ExpirationAlerts />
      </div>

      {/* Main Header Section */}
      <div className="header">
        <div className="greeting">
          <h1>
            {greeting}, {user?.name || "Guest"}!
          </h1>
          <p>Welcome to your inventory management system.</p>
        </div>
      </div>

      {/* Main Content */}
      <InventoryManager />
    </div>
  );
};

export default UserHome;
