import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExpirationAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/alerts")
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

  return (
    <div>
      <ToastContainer />
      <h2>Items Nearing Expiration</h2>
      {alerts.length === 0 ? (
        <p>No items are nearing expiration.</p>
      ) : (
        <ul>
          {alerts.map((item) => (
            <li key={item.id}>
              {item.name} - Expires on: {item.expiration_date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpirationAlerts;
