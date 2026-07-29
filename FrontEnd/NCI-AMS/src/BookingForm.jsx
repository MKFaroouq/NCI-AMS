import React, { useEffect, useState } from 'react';
import logo from './assets/mciLogo.png';
import CheckStatus from './CheckStatus';
import Swal from 'sweetalert2';
import { createBooking, getClinics } from './api/bookingApi';

const BookingForm = () => {
    const [activeTab, setActiveTab] = useState('bookings');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [clinics, setClinics] = useState([]);
    const [clinicsLoading, setClinicsLoading] = useState(true);
    const [clinicsError, setClinicsError] = useState('');

    // بنجيب قائمة العيادات مرة واحدة لما الصفحة تفتح
    useEffect(() => {
        async function loadClinics() {
            try {
                const data = await getClinics();
                setClinics(data);
            } catch (err) {
                setClinicsError(err.message);
            } finally {
                setClinicsLoading(false);
            }
        }
        loadClinics();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData); // للفاليديشن بس

        // فاليديشن بسيط قبل ما نتعب السيرفر
        if (values.nationalId.trim().length !== 14) {
            Swal.fire({
                title: 'الرقم القومي غير صحيح',
                text: 'الرقم القومي لازم يتكون من 14 رقم بالظبط.',
                icon: 'warning',
                confirmButtonText: 'حسناً',
                confirmButtonColor: '#d97706',
            });
            return;
        }

        const idImage = formData.get('nationalIdImage');
        if (!idImage || idImage.size === 0) {
            Swal.fire({
                title: 'صورة البطاقة مطلوبة',
                text: 'من فضلك ارفع صورة واضحة للبطاقة الشخصية.',
                icon: 'warning',
                confirmButtonText: 'حسناً',
                confirmButtonColor: '#d97706',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            await createBooking(formData);

            Swal.fire({
                title: 'تم استلام طلبك بنجاح!',
                text: 'الحالة الآن: تحت المراجعة من موظف المستشفى وسيتم إصدار رقم تذكرتك فوراً بعد الموافقة.',
                icon: 'success',
                confirmButtonText: 'ممتاز',
                confirmButtonColor: '#0c2340',
            });

            e.target.reset();
            setActiveTab('status');
        } catch (error) {
            Swal.fire({
                title: 'عفواً، تعذر الحجز',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'موافق',
                confirmButtonColor: '#dc2626',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

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
    );
};

export default BookingForm;