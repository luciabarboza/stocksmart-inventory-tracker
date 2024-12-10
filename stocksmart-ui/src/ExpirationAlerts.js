import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaBell } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./expirationalerts.css";

const ExpirationAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5001/inventory/alerts")
      .then((response) => response.json())
      .then((data) => {
        setAlerts(data);
        if (data.length > 0) {
          toast.warn(`${data.length} items are nearing expiration!`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((error) => console.error("Error fetching alerts:", error));
  }, []);

  const toggleAlerts = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="expiration-alerts">
      <ToastContainer />
      {/* Bell Icon */}
      <div className="bell-icon" onClick={toggleAlerts}>
        <FaBell size={24} />
        {alerts.length > 0 && <span className="badge">{alerts.length}</span>}
      </div>

      {/* Expanded Alert List */}
      {isExpanded && (
        <div className="alerts-list">
          <h2>Items Nearing Expiration</h2>
          {alerts.length === 0 ? (
            <p>No items are nearing expiration.</p>
          ) : (
            <ul>
              {alerts.map((item) => (
                <li key={item.id}>
                  {item.item_name} - Expires on: {item.expiration_date}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpirationAlerts;
