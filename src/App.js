
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './SignIn';
import Table from './Table';
import './App.css';
import SignUp from './register';
import Usuarios from './usuarios';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/table" element={<Table />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;