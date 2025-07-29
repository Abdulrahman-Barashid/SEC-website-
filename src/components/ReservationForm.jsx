import { useState } from 'react';
import './css/ReservationForm.css';

const ReservationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    file: null
  });

  const handleInputChange = (e) => {
  const { name, value } = e.target;

  if (name === 'name') {
    const lettersOnly = value.replace(/[^A-Za-z\u0600-\u06FF\s]/g, ''); 
    setFormData(prev => ({ ...prev, [name]: lettersOnly }));
  } else if (name === 'phone') {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 10); 
  setFormData(prev => ({ ...prev, [name]: digitsOnly }));
}
};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      file: file
    }));
  };

  const handleSubmit = () => {
  if (
    formData.name &&
    formData.phone &&
    formData.phone.length === 10 
  ) {
    onSubmit({
      ...formData,
      date: new Date().toLocaleDateString('ar-SA')
    });
    setFormData({ name: '', phone: '', file: null });
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  } else {
    alert('يرجى التأكد من إدخال الاسم ورقم هاتف مكوّن من 10 أرقام.');
  }
};

  return (
    <main className="main-form">
      <div className="form-container">
        <h2 className="form-title">تسجيل حجز جديد</h2>
        <div className="student-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">الاسم</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="أدخل الاسم"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">رقم الهاتف</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="أدخل رقم الهاتف"
                required
              />
            </div>
          </div>
          
          <div className="form-group file-group">
            <label htmlFor="file-upload" className="file-label">
              رفع ملف (اختياري)
            </label>
            <div className="file-input-container">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.png"
                className="file-input"
              />
              <button type="button" className="file-button" onClick={() => document.getElementById('file-upload').click()}>
                اختر ملف
              </button>
              {formData.file && (
                <span className="file-name">{formData.file.name}</span>
              )}
            </div>
          </div>
          
          <button type="button" onClick={handleSubmit} className="submit-button">
            حفظ الطلب
          </button>
        </div>
      </div>
    </main>
  );
};

export default ReservationForm;