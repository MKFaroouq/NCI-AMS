// كل الـ requests بتاعة الحجز والعيادات في مكان واحد
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
export async function createBooking(formData) {
    const res = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "حدث خطأ أثناء الحجز");
    }

    return data;
}

// الاستعلام عن حالة الحجز بالرقم القومي
export async function checkBookingStatus(nationalId) {
    const res = await fetch(`${BASE_URL}/bookings/status/${nationalId}`); // 👈 s

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "عفواً، لا يوجد حجز مسجل بهذا الرقم القومي");
    }

    return data; // بيرجع الـ booking object مباشرة، مش متغلف جوه key
}