import './css/Sidebar.css';

const Sidebar = ({ orders, onDeleteOrder }) => {
  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">الطلبات المحفوظة</h3>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p className="no-orders">لا توجد طلبات محفوظة</p>
        ) : (
          orders.map((order, index) => (
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
                {order.file && (
                  <div className="order-file">
                    📎 {order.file.name}
                    <button
                      className="view-file-btn"
                      onClick={() => {
                        const fileURL = URL.createObjectURL(order.file);
                        window.open(fileURL, '_blank');
                      }}
                    >
                      عرض الملف
                    </button>
                  </div>
                )}
                <div className="order-date">{order.date}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
