// src/App.js
import React from 'react';
import EmailChecker from './EmailChecker';
import Chatbot from './Chatbot'; // Import Chatbot component
import './App.css';

function App() {
  return (
    <div className="App">
      <EmailChecker />
      <Chatbot /> {/* Render Chatbot component */}
    </div>
  );
}

export default App;