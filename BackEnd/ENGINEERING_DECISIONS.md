# NCI-Q Backend Engineering Decisions

This document records the important engineering decisions made during Backend Phase 1.

It explains:

- Why something was changed.
- What problem existed.
- How it was improved.
- Future improvements planned for later versions.

---

# Decision #1
## Admin Authentication

### Initial Implementation

Admin authentication logic was placed inside `bookingController.js`.

```text
bookingController
 ├── adminLogin()
 ├── createBooking()
 ├── approveBooking()
 └── rejectBooking()
```

### Problem

The controller became responsible for two different domains:

- Authentication
- Booking Management

This violated the Single Responsibility Principle (SRP).

### Solution

Authentication was moved into its own controller.

```text
authController.js

adminLogin()
```

Routes were also separated.

Before

```
POST /api/auth/login
inside bookingRoutes.js
```

After

```
authRoutes.js
```

Result

- Cleaner architecture.
- Easier maintenance.
- Easier future expansion (multiple admin accounts).

---

# Decision #2
## Export Style

### Initial Idea

Export only one clinic.

```
POST /export/:clinicId
```

### Problem

Hospital operators export all clinics at the end of the day.

Exporting one clinic at a time is inefficient.

### Solution

Added

```
POST /export/all
```

Now Excel contains

Workbook

├── Surgery
├── Oncology
├── Radiotherapy
└── ...

Each clinic has its own worksheet.

Result

One export operation for the entire hospital.

---

# Decision #3
## OCR & Image Upload

### Initial Plan

Booking creation required

- Multer
- National ID image
- OCR (Tesseract)

### Problem

Testing became difficult.

Creating bookings from Postman required multipart/form-data.

OCR failures prevented testing business rules.

### Solution

Removed OCR and Upload from Phase 1.

Current

```
POST Booking

↓

Booking Saved
```

Future

```
POST Booking

↓

Upload Image

↓

OCR

↓

Validate National ID

↓

Save Booking
```

Result

Faster development.

Business logic was completed first.

---

# Decision #4
## Delete Booking

### Initial Implementation

```javascript
Booking.findByIdAndDelete(id)
```

### Problem

Business Rules cannot be checked before deletion.

Example

```
Cannot delete exported booking.
```

### Solution

Retrieve booking first.

```javascript
const booking = await Booking.findById(id);

...

await Booking.findByIdAndDelete(id);
```

Result

Future business rules can be added easily.

---

# Decision #5
## Booking Status

Current Workflow

Pending

↓

Approved

↓

Exported

or

Pending

↓

Rejected

Reason

Simple workflow for MVP.

Future

Export state may become independent from booking status.

Example

```
status = approved

exportedAt = Date
```

instead of

```
status = exported
```

Reason

Allows exporting reports multiple times.

---

# Decision #6
## Queue Generation

Initial Concern

Generate queue number immediately after booking.

Problem

Rejected bookings would consume queue numbers.

Solution

Queue number is generated ONLY after approval.

Workflow

Patient

↓

Pending

↓

Approve

↓

Generate Queue Number

↓

Approved

Result

Queue numbers remain continuous.

---

# Decision #7
## Weekly Booking Limit

Requirement

Patient may create at most

3 bookings every 7 days.

Implementation

MongoDB query

```
countDocuments()
```

filtered by

- National ID
- Pending
- Approved
- Last 7 days

Reason

Rejected bookings do not consume weekly quota.

---

# Decision #8
## Duplicate Booking Prevention

Requirement

Patient cannot create two active bookings for the same clinic.

Implementation

MongoDB Partial Unique Index

```
nationalId
clinicId
status
```

Only

```
pending
approved
```

are considered.

Result

Rejected bookings allow creating a new request.

---

# Decision #9
## Hard Delete

Current

Hard Delete.

Reason

Simpler MVP.

Future

Soft Delete.

```
deletedAt

isDeleted
```

Reason

Medical systems should preserve history.

---

# Decision #10
## Controller Size

Current

Validation lives inside controllers.

Reason

Simplifies learning and debugging.

Future

Move validation into middleware.

Example

```
validateBooking()

↓

Controller
```

Result

Cleaner controllers.

---

# Decision #11
## Error Handling

Current

Every controller contains

```
try {

} catch {

}
```

Future

Global Error Middleware

```
Controller

↓

next(error)

↓

Error Middleware
```

Result

Less duplicated code.

---

# Decision #12
## Admin Credentials

Current

Stored inside

```
.env
```

Future

Admin Collection

Benefits

- Multiple admins.
- Password hashing.
- Roles.
- Permissions.

---

# Phase 1 Conclusion

The first backend version focuses on delivering a working MVP.

Several advanced features were intentionally postponed to Phase 2 to keep the project simple, testable, and maintainable.