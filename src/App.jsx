import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import ReservationForm from './components/ReservationForm.jsx';
import Home from './components/Home.jsx';
import './App.css';

const App = () => {
  const [orders, setOrders] = useState([]);

  const handleAddOrder = (order) => {
    setOrders([...orders, { ...order, id: Date.now() }]);
  };

  const handleDeleteOrder = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  return (
    <>
      <Header />
      <div className="app-layout">
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/create"
              element={<ReservationForm onSubmit={handleAddOrder} />}
            />
          </Routes>
        </div>
        <div className="divider"></div>
        <Sidebar orders={orders} onDeleteOrder={handleDeleteOrder} />
      </div>
    </>
  );
};

export default App;
