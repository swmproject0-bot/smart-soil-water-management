import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [sensorData, setSensorData] = useState({
    moisture: 0,
    temperature: 0,
    humidity: 0,
    ph: 0,
  });

  const [waterData, setWaterData] = useState({
    water_required_liters: 0,
    priority: "",
  });

  const [result, setResult] = useState("");

  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  useEffect(() => {
    fetchSensorData();
    fetchWaterRequirement();
  }, []);

  const fetchSensorData = async () => {
    try {
      const response = await axios.get(
        "https://smart-soil-water-management.onrender.com/sensor-data"
      );

      setSensorData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWaterRequirement = async () => {
    try {
      const response = await axios.get(
        "https://smart-soil-water-management.onrender.com/water-requirement"
      );

      setWaterData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const predictCrop = async () => {
    try {
      const response = await axios.post(
        "https://smart-soil-water-management.onrender.com/predict",
        {
          N: Number(formData.N),
          P: Number(formData.P),
          K: Number(formData.K),
          temperature: Number(formData.temperature),
          humidity: Number(formData.humidity),
          ph: Number(formData.ph),
          rainfall: Number(formData.rainfall),
        }
      );

      setResult(response.data.recommended_crop);
    } catch (error) {
      console.log(error);
      alert("Prediction Failed");
    }
  };

  const cardStyle = {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
  };

  const inputStyle = {
    padding: "12px",
    width: "260px",
    margin: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    color: "#222",
    backgroundColor: "#fff",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F8FB",
        padding: "30px",
        fontFamily: "Segoe UI",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#1B5E20",
          fontSize: "48px",
        }}
      >
        🌱 Smart Soil Water Management
      </h1>

      <h3
        style={{
          textAlign: "center",
          color: "#546E7A",
          marginBottom: "40px",
        }}
      >
        Digital Twin + IoT + Machine Learning
      </h3>

      {/* Sensor Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h2 style={{ color: "#1976D2" }}>
            💧 Soil Moisture
          </h2>
          <h1 style={{ color: "#263238" }}>
            {sensorData.moisture}%
          </h1>
        </div>

        <div style={cardStyle}>
          <h2 style={{ color: "#EF6C00" }}>
            🌡 Temperature
          </h2>
          <h1 style={{ color: "#263238" }}>
            {sensorData.temperature}°C
          </h1>
        </div>

        <div style={cardStyle}>
          <h2 style={{ color: "#0097A7" }}>
            💦 Humidity
          </h2>
          <h1 style={{ color: "#263238" }}>
            {sensorData.humidity}%
          </h1>
        </div>

        <div style={cardStyle}>
          <h2 style={{ color: "#8E24AA" }}>
            🧪 pH
          </h2>
          <h1 style={{ color: "#263238" }}>
            {sensorData.ph}
          </h1>
        </div>

        <div style={cardStyle}>
          <h2 style={{ color: "#1565C0" }}>
            🚰 Water Required
          </h2>
          <h1 style={{ color: "#263238" }}>
            {waterData.water_required_liters} L
          </h1>

          <h3
            style={{
              color:
                waterData.priority === "High"
                  ? "red"
                  : waterData.priority === "Medium"
                  ? "orange"
                  : "green",
            }}
          >
            {waterData.priority}
          </h3>
        </div>
      </div>

      {/* Crop Recommendation */}
      <div
        style={{
          marginTop: "40px",
          background: "#fff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#2E7D32" }}>
          🌾 Crop Recommendation
        </h2>

        <input
          style={inputStyle}
          name="N"
          placeholder="Nitrogen"
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          name="P"
          placeholder="Phosphorus"
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          name="K"
          placeholder="Potassium"
          onChange={handleChange}
        />

        <br />

        <input
          style={inputStyle}
          name="temperature"
          placeholder="Temperature"
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          name="humidity"
          placeholder="Humidity"
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          name="ph"
          placeholder="pH"
          onChange={handleChange}
        />

        <br />

        <input
          style={inputStyle}
          name="rainfall"
          placeholder="Rainfall"
          onChange={handleChange}
        />

        <br />

        <button
          onClick={predictCrop}
          style={{
            marginTop: "20px",
            padding: "14px 35px",
            background: "#2E7D32",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Predict Crop
        </button>

        {result && (
          <div
            style={{
              marginTop: "25px",
              background: "#E8F5E9",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            <h2 style={{ color: "#1B5E20" }}>
              🌾 Recommended Crop: {result}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;