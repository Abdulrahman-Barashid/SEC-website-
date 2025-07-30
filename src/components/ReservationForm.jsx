import { useState } from 'react';
import './css/ReservationForm.css';

const ReservationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

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

    // Create preview URL for the file
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(null);
    }
  };

  const handlePreviewFile = () => {
    if (filePreview) {
      window.open(filePreview, '_blank');
    }
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
    setFilePreview(null);
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async () => {
    if (
      formData.name &&
      formData.phone &&
      formData.phone.length === 10 
    ) {
      setIsSubmitting(true);
      
      try {
        // Create FormData for file upload
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('phone', formData.phone);
        if (formData.file) {
          submitData.append('file', formData.file);
        }

        // Send to backend API
        const response = await fetch('http://localhost:5000/api/reservations', {
          method: 'POST',
          body: submitData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save reservation');
        }

        const savedReservation = await response.json();
        
        // Call parent component's onSubmit function
        onSubmit(savedReservation);
        
        // Reset form
        setFormData({ name: '', phone: '', file: null });
        setFilePreview(null);
        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = '';
        
        alert('تم حفظ الطلب بنجاح!');
        
      } catch (error) {
        console.error('Error saving reservation:', error);
        alert(`حدث خطأ أثناء حفظ الطلب: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                accept=".pdf,.doc,.docx,.jpg,.png,.jpeg,.gif"
                className="file-input"
                disabled={isSubmitting}
              />
              <button 
                type="button" 
                className="file-button" 
                onClick={() => document.getElementById('file-upload').click()}
                disabled={isSubmitting}
              >
                اختر ملف
              </button>
              {formData.file && (
                <div className="file-preview">
                  <span className="file-name">📎 {formData.file.name}</span>
                  <div className="file-actions">
                    <button
                      type="button"
                      className="preview-button"
                      onClick={handlePreviewFile}
                      disabled={isSubmitting}
                    >
                      معاينة
                    </button>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={handleRemoveFile}
                      disabled={isSubmitting}
                    >
                      إزالة
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <button 
            type="button" 
            onClick={handleSubmit} 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جاري الحفظ...' : 'حفظ الطلب'}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ReservationForm;