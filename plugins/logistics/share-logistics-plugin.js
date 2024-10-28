// src/logisticsPlugin.js

function LogisticsPlugin(options) {
    if (!options || !options.apiEndpoint) {
      throw new Error("API endpoint is required");
    }
  
    this.apiEndpoint = options.apiEndpoint;
  
    // Function to place an order
    this.placeOrder = function (orderInfo, callback) { 
      // Make an API request
      fetch(this.apiEndpoint + "/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderInfo),
      })
        .then((response) => response.json())
        .then((data) => {
          callback(null, data); // Success callback
        })
        .catch((error) => {
          callback(error, null); // Error callback
        });
    };
  }
  
  export default LogisticsPlugin;
  