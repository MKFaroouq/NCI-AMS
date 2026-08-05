// كل الـ requests بتاعة الحجز والعيادات في مكان واحد
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// جلب قائمة العيادات عشان الـ dropdown
export async function getClinics() {
    const res = await fetch(`${BASE_URL}/clinics`);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "مقدرناش نجيب قائمة العيادات");
    }

    return data.clinics;
}

// إنشاء حجز جديد - multipart لأن فيها صورة البطاقة
export async function createBooking(bookingData) {
    const res = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "حدث خطأ أثناء الحجز");
    }

    return data;
}

// الاستعلام عن حالة الحجز بالرقم القومي
export async function checkBookingStatus(nationalId) {
  const res = await fetch(`${BASE_URL}/bookings/patient/${nationalId}`);

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Sorry, no booking found with this national ID");
    }

    return data; // بيرجع الـ booking object مباشرة، مش متغلف جوه key
}

// ======================================
// Get Patient Bookings By National ID
// GET /api/bookings/patient/:nationalId
// ======================================
export async function getPatientBookings(nationalId) {
  const response = await fetch(
    `${BASE_URL}/bookings/patient/${nationalId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch bookings");
  }

  return data;
}
