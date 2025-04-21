import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';

function App() {
  return (
    <Router>
      <Routes>
        {/* Change the default route to point to Login page */}
        <Route path="/" element={<Login />} />  
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
