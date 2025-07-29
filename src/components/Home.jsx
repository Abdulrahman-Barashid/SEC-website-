import './css/Home.css';
import taskImage1 from '../assets/task1.png'; 
import taskImage2 from '../assets/task2.png';

const Home = () => {
  return (
    <div className="home-ads">
  <h2 className="ads-title">المهام المتبقية لإنهاء برنامج التدريب الصيفي</h2>

  <div className="ad-card">
    <img src={taskImage1} alt="Task 1" className="ads-image" />
    <p className="ad-description">بناء واجهة بسيطة تحتوي على الطلبات المنشأة من قبل المستخدمين</p>
  </div>

  <hr className="ad-divider" />

  <div className="ad-card">
    <img src={taskImage2} alt="Task 2" className="ads-image" />
    <p className="ad-description">تحليل مرئي للبيانات من قاعدة بيانات وهمية باستخدام Power BI</p>
  </div>
</div>

  );
};

export default Home;