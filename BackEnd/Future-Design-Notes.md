# Future Design Note — Booking Date vs Visit Date

## Background

During Phase 1 of the NCI-Q project, the system is designed as a **Queue & Booking Layer**, not a full Hospital Information System (HIS).

Currently, every booking is considered for **today**, and queue numbers are generated for the current day only.

---

## Current Design (Phase 1)

The system should automatically save the booking creation timestamp.

```text
bookingDate = Date.now()
```

This field represents **when the patient submitted the booking request**.

Example:

* Patient submits request at **01 Aug 2026 - 10:35 AM**
* bookingDate = `2026-08-01T10:35:00`

This field should never be edited by the patient.

---

## Future Requirement (Phase 2+)

Some clinics or consultants may not accept patients every day.

Examples:

* Consultant clinic works only on Tuesday.
* Surgery clinic accepts patients next week.
* Hospital postpones appointments because of holidays.
* Doctor is unavailable today.

In these cases, the queue should be generated based on the **visit day**, not the booking creation day.

Therefore, introduce a second field:

```text
visitDate
```

This field represents:

> The actual day the patient is expected to visit the hospital.

Example:

Booking submitted:

```text
bookingDate
2026-08-01 10:35 AM
```

Patient scheduled for:

```text
visitDate
2026-08-05
```

Queue generation should use **visitDate**.

---

## Proposed Schema

```js
bookingDate: {
    type: Date,
    default: Date.now
},

visitDate: {
    type: Date,
    required: true
}
```

---

## Queue Rule

Queue Number should be generated using:

* Clinic
* Visit Date

NOT using Booking Date.

This keeps the queue reset correctly every visit day while preserving the original booking timestamp.

---

## Phase 1 Decision

For now:

* bookingDate is automatically generated.
* visitDate equals today's date.
* The patient cannot choose the date.
* No appointment scheduling UI is required.

---

## Why This Design?

This approach keeps the MVP simple while making the database ready for future features such as:

* Consultant schedules
* Future appointments
* Holiday rescheduling
* Multi-day booking
* Appointment management

Without requiring database redesign later.
