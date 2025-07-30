import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import ReservationForm from './components/ReservationForm.jsx';
import Home from './components/Home.jsx';
import './App.css';

const App = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load orders from database on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/reservations');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(data);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('فشل في تحميل الطلبات. تأكد من تشغيل الخادم.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reservations/${orderId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      setOrders(prev => prev.filter(order => order.id !== orderId));
      
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('حدث خطأ أثناء حذف الطلب');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <p>جاري تحميل البيانات...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchOrders} className="retry-button">
            إعادة المحاولة
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="app-layout">
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/create"
              element={<ReservationForm onSubmit={handleNewOrder} />}
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