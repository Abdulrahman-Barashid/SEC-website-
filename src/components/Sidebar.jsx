import './css/Sidebar.css';

const Sidebar = ({ orders, onDeleteOrder }) => {
  const handleViewFile = (order) => {
    if (order.filePath) {
      // Open file from backend server
      window.open(`http://localhost:5000/api/files/${order.filePath}`, '_blank');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sort orders by creation date (oldest first)
  const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">الطلبات المحفوظة</h3>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p className="no-orders">لا توجد طلبات محفوظة</p>
        ) : (
          sortedOrders.map((order, index) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-number">طلب {index + 1}</span>
                <button
                  className="delete-btn"
                  onClick={() => onDeleteOrder(order.id)}
                  title="حذف الطلب"
                >
                  ×
                </button>
              </div>
              <div className="order-content">
                <div className="order-name">{order.name}</div>
                <div className="order-phone">{order.phone}</div>
                {order.fileName && (
                  <div className="order-file">
                    📎 {order.fileName}
                    <button
                      className="view-file-btn"
                      onClick={() => handleViewFile(order)}
                    >
                      عرض الملف
                    </button>
                  </div>
                )}
                <div className="order-date">{formatDate(order.createdAt)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;