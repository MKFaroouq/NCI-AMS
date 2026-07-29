import { useEffect, useState } from "react";
import { getClinics, createBooking } from "../api/bookingApi";

// الشكل الأولي للفورم - كل الحقول فاضية
const initialForm = {
  patientName: "",
  nationalId: "",
  phone: "",
  clinicId: "",
  department: "",
};

function PatientBookingPage() {
  const [clinics, setClinics] = useState([]);
  const [clinicsLoading, setClinicsLoading] = useState(true);
  const [clinicsError, setClinicsError] = useState("");

  const [form, setForm] = useState(initialForm);
  const [idImage, setIdImage] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  // handler عام لأي input نصي (بنستخدم name بتاع الـ input)
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    setIdImage(file || null);
  }

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
    } catch (err) {
      setSubmitError(err.message);
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
    <div className="min-h-screen bg-clinic-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-clinic-900">
            حجز كشف جديد
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            املأ بياناتك وهيتم مراجعة الطلب من موظف الاستقبال
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-clinic-100 p-6 space-y-4"
        >
          {submitError && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 border border-red-100">
              {submitError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              الاسم بالكامل
            </label>
            <input
              type="text"
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-clinic-600 focus:border-clinic-600"
              placeholder="اسمك زي ما هو في البطاقة"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              الرقم القومي
            </label>
            <input
              type="text"
              name="nationalId"
              value={form.nationalId}
              onChange={handleChange}
              maxLength={14}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-clinic-600 focus:border-clinic-600"
              placeholder="14 رقم"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              رقم الموبايل
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-clinic-600 focus:border-clinic-600"
              placeholder="01xxxxxxxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              العيادة
            </label>

            {clinicsLoading ? (
              <p className="text-sm text-slate-400">جاري تحميل العيادات...</p>
            ) : clinicsError ? (
              <p className="text-sm text-red-600">{clinicsError}</p>
            ) : (
              <select
                name="clinicId"
                value={form.clinicId}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-clinic-600 focus:border-clinic-600"
              >
                <option value="">اختر العيادة</option>
                {clinics.map((clinic) => (
                  <option key={clinic._id} value={clinic._id}>
                    {clinic.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              القسم (اختياري)
            </label>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-clinic-600 focus:border-clinic-600"
              placeholder="مثال: جراحة عامة"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              صورة البطاقة (اختياري)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-clinic-100 file:text-clinic-700 file:font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-cta-500 hover:bg-cta-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "جاري الإرسال..." : "إرسال الطلب"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PatientBookingPage;
