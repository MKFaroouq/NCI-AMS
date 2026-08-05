import { useEffect, useRef, useState } from "react";
// import axios from "axios";
import logo from "../assets/mcilogo.png";
import CheckStatus from '../CheckStatus.jsx';
import Swal from 'sweetalert2';

// import { getClinics, createBooking } from "../api/bookingApi";
const API_URL = "http://localhost:8000/api";

const initialForm = {
  patientName: "",
  nationalId: "",
  phone: "",
  governorate: "Menoufia",
  clinicId: "",
};

function PatientBookingPage() {

const [activeTab, setActiveTab] = useState('bookings');
  
// Page Data
const [clinics, setClinics] = useState([]);

// Loading States
const [clinicsLoading, setClinicsLoading] = useState(true);
const [submitting, setSubmitting] = useState(false);

// Error States
const [clinicsError, setClinicsError] = useState("");
const [submitError, setSubmitError] = useState("");

// Form State
const [form, setForm] = useState(initialForm);
const [idImage, setIdImage] = useState(null);

// UI State
const [successMessage, setSuccessMessage] = useState("");


// const [idImage, setIdImage] = useState(null);

// get all clinics from the backend - Fetch clinics when the page loads
  useEffect(() => {
    async function loadClinics() {
      try {
    const response = await axios.get(`${API_URL}/clinics`);
        setClinics(response.data);
      } catch (error) {
        console.log(error);
        console.log(error.response);
        console.log(error.message);
        console.log(error.response);       

  setClinicsError(error.message);
}
       finally {
        setClinicsLoading(false);
      }
    }

    loadClinics();
  }, []);
   

  // handler عام لأي input نصي (بنستخدم name بتاع الـ input)
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // const function handleImageChange(e) {
  //   const file = e.target.files[0];
  //   setIdImage(file || null);
  // }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    // تحقق بسيط قبل الإرسال (الفاليديشن الحقيقي هيكون في السيرفر برضو)
    if (!form.patientName || !form.nationalId || !form.phone || !form.clinicId) {
      setSubmitError("من فضلك املأ كل الحقول المطلوبة");
      return;
    }

    const formData = new FormData();
    formData.append("patientName", form.patientName);
    formData.append("nationalId", form.nationalId);
    formData.append("phone", form.phone);
    formData.append("clinicId", form.clinicId);
    formData.append("department", form.department);

    if (idImage) {
      formData.append("idImage", idImage);
    }

    setSubmitting(true);

    try {
      await createBooking(formData);
      setSuccessMessage(
        "تم إرسال طلب الحجز بنجاح. هيتم مراجعته، ولو اتوافق عليه هياخد رقم في الطابور."
      );
      setForm(initialForm);
      setIdImage(null);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  // بعد نجاح الإرسال، بنعرض شاشة تأكيد بدل الفورم
  if (successMessage) {
    return (
      <div className="min-h-screen bg-clinic-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-clinic-100 p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-clinic-100 text-clinic-700 flex items-center justify-center mx-auto mb-4 text-2xl">
            ✓
          </div>
          <h2 className="text-xl font-bold text-clinic-900 mb-2">
            تم استلام طلبك
          </h2>
          <p className="text-slate-600 mb-6">{successMessage}</p>
          <button
            onClick={() => setSuccessMessage("")}
            className="w-full bg-clinic-700 hover:bg-clinic-900 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            حجز طلب جديد
          </button>
        </div>
      </div>
    );
  }

    return (
        <div dir="rtl">
            <header>
                <div className="logo-area">
                    <img src={logo} alt="Logo" className="mci-logo-img" />
                    <span className="logo-text">معهد الاورام - جامعة المنوفية</span>
                </div>

                <button
                    type="button"
                    className={`toggle-btn ${activeTab === 'status' ? 'status-mode' : ''}`}
                    onClick={() => setActiveTab(activeTab === 'booking' ? 'status' : 'booking')}
                >
                    {activeTab === 'booking' ? 'الاستعلام عن الدور' : 'العودة للحجز'}
                </button>
            </header>

            <main className="main-content">
                <div className="login-card">
                    {activeTab === 'booking' ? (
                        <>
                            <h2 className="card-title">الدخول إلى البوابة</h2>
                            <p className="card-subtitle">يرجى إدخال بياناتك للمتابعة</p>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="nationalId">الرقم القومي</label>
                                    <input
                                        type="text"
                                        id="nationalId"
                                        name="nationalId"
                                        maxLength={14}
                                        className="form-control"
                                        placeholder="اكتب الـ 14 رقم بالكامل"
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="patientName">اسم المريض بالكامل</label>
                                    <input
                                        type="text"
                                        id="patientName"
                                        name="patientName"
                                        className="form-control"
                                        placeholder="كما هو مكتوب في البطاقة الشخصية"
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="governorate">المحافظة</label>
                                    <input
                                        type="text"
                                        id="governorate"
                                        name="governorate"
                                        className="form-control"
                                        placeholder="مثال: المنوفية"
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="clinicId">العيادة</label>
                                    {clinicsLoading ? (
                                        <p>جاري تحميل العيادات...</p>
                                    ) : clinicsError ? (
                                        <p style={{ color: '#dc2626' }}>{clinicsError}</p>
                                    ) : (
                                        <select
                                            id="clinicId"
                                            name="clinicId"
                                            className="form-control select-custom"
                                            defaultValue=""
                                            disabled={isSubmitting}
                                            required
                                        >
                                            <option value="" disabled>اختر العيادة</option>
                                            {clinics.map((clinic) => (
                                                <option key={clinic._id} value={clinic._id}>
                                                    {clinic.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="nationalIdImage">صورة البطاقة الشخصية</label>
                                    <input
                                        type="file"
                                        id="nationalIdImage"
                                        name="nationalIdImage"
                                        accept="image/*"
                                        className="form-control"
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>

                                <div className="row-inputs">
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">رقم الموبايل</label>
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            className="form-control ltr-input"
                                            placeholder="01X XXXX XXXX"
                                            disabled={isSubmitting}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'جاري الإرسال...' : 'دخول البوابة'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <CheckStatus />
                    )}
                </div>
            </main>

            <footer>
                <div className="footer-detail">
                    <h3 className="footer-title">معهد الأورام - جامعة المنوفية</h3>
                    <p className="footer-subtitle">مدينة شبين الكوم - محافظة المنوفية - مصر</p>
                </div>
                <div className="footer-copyright">معهد الأورام . جميع الحقوق محفوظة 2026 &copy;</div>
            </footer>
        </div>
    )};

export default PatientBookingPage;
