# NCI-Q Backend Phase 1

## Goal

بناء أول نسخة Backend قابلة للاستخدام (MVP).

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- ExcelJS
- dotenv

---

## Folder Structure

backend/

controllers/
models/
routes/
middleware/

app.js

---

## Database

Booking Collection

Clinic Collection

Counter Collection

---

## Features

### Authentication

- Admin Login
- JWT Authentication

---

### Clinics

- Get Active Clinics
- Add Clinic

---

### Booking

- Create Booking
- Get All Bookings
- Get Pending Bookings
- Approve Booking
- Reject Booking
- Delete Booking

---

### Export

- Export Single Clinic
- Export All Clinics

---

## Business Rules

Rule #1
Queue Number generated after approval only.

Rule #2
Queue resets every day.

Rule #3
Queue separated by clinic.

Rule #4
Maximum 3 bookings / 7 days.

Rule #5
Rejected requests never receive queue number.

Rule #6
Clinic daily quota.

---

## What we intentionally postponed

- OCR (Tesseract)
- Multer
- QR Code
- SMS
- Socket.io
- HIS Integration
- Audit Logs

---

## Backend Status

Phase 1 ✅ Completed