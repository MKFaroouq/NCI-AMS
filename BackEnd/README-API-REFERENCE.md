# API Reference

Base URL

http://localhost:8000/api

---

# Authentication

POST /auth/login

Body

```json
{
  "username":"",
  "password":""
}
```

Response

```json
{
  "token":"..."
}
```

---

# Clinics

GET /clinics

Description

Returns active clinics.

---

POST /clinics

Authorization

Bearer Token

Body

...

---

# Bookings

POST /bookings

Description

Create new booking.

Body

...

---

GET /bookings

Authorization

Bearer Token

Returns all bookings.

---

GET /bookings/pending

Authorization

Bearer Token

Returns pending bookings.

---

PUT /bookings/:id/approve

Authorization

Bearer Token

Approves booking.

---

PUT /bookings/:id/reject

Authorization

Bearer Token

Reject booking.

---

DELETE /bookings/:id

Authorization

Bearer Token

Delete booking.

---

POST /bookings/export/:clinicId

Authorization

Bearer Token

Export one clinic.

---

POST /bookings/export/all

Authorization

Bearer Token

Export all clinics.