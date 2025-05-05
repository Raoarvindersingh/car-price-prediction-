import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    year: '',
    present_price: '',
    kms_driven: '',
    fuel_type: 'Petrol',
    seller_type: 'Dealer',
    transmission: 'Manual',
    owner: 0
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/predict', formData);
      setPrediction(res.data.estimated_selling_price_lakhs.toFixed(2));
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Prediction failed. Please try again.');
    }
  };

  return (
    <div className="App">
      <h1>🚗 AI-Powered Car Resale Valuation and Analytics Suite</h1>
      
      <form onSubmit={handleSubmit}>
        
        <label>Year of Purchase</label>
        <input 
          type="number" 
          name="year" 
          value={formData.year} 
          onChange={handleChange} 
          required 
        />

        <label>Present Price (in Lakhs)</label>
        <input 
          type="number" 
          name="present_price" 
          step="0.1"
          value={formData.present_price} 
          onChange={handleChange} 
          required 
        />

        <label>KMs Driven</label>
        <input 
          type="number" 
          name="kms_driven" 
          value={formData.kms_driven} 
          onChange={handleChange} 
          required 
        />

        <label>Fuel Type</label>
        <select name="fuel_type" value={formData.fuel_type} onChange={handleChange}>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="CNG">CNG</option>
        </select>

        <label>Seller Type</label>
        <select name="seller_type" value={formData.seller_type} onChange={handleChange}>
          <option value="Dealer">Dealer</option>
          <option value="Individual">Individual</option>
        </select>

        <label>Transmission Type</label>
        <select name="transmission" value={formData.transmission} onChange={handleChange}>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>

        <label>Number of Owners</label>
        <input 
          type="number" 
          name="owner" 
          min="0" 
          max="3" 
          value={formData.owner} 
          onChange={handleChange} 
          required 
        />

        <button type="submit">Predict Price</button>
      </form>

      {prediction !== null && (
        <h2>🔮 Predicted Selling Price: ₹ {prediction} lakhs</h2>
      )}

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}
    </div>
  );
}

export default App;
