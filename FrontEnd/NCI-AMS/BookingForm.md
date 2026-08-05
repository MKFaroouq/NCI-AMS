# BookingForm.jsx

## Overview

`BookingForm.jsx` is the main entry page for patients in NCI-Q V1.

The page has two modes:

- Booking Form
- Check Booking Status

The user can switch between them without leaving the page.

---

# Responsibilities

The Booking Form is responsible for:

- Loading available clinics from the backend.
- Displaying the booking form.
- Validating user input.
- Sending a booking request.
- Showing success or error messages.
- Redirecting the user to Check Status after successful booking.

It is NOT responsible for:

- Queue generation.
- Booking approval.
- Authentication.
- Data Entry operations.

Those are handled by the backend.

---

# UI State

```jsx
const [activeTab, setActiveTab] = useState("booking");
```

Controls which page is currently displayed.

Possible values:

- booking
- status

---

```jsx
const [isSubmitting, setIsSubmitting] = useState(false);
```

Prevents multiple submissions while waiting for the API response.

---

# Clinics State

```jsx
const [clinics, setClinics] = useState([]);
```

Stores the list of clinics received from the backend.

---

```jsx
const [clinicsLoading, setClinicsLoading] = useState(true);
```

Shows loading state while requesting clinics.

---

```jsx
const [clinicsError, setClinicsError] = useState("");
```

Stores API errors if clinics cannot be loaded.

---

# Loading Clinics

Runs once when the component mounts.

```jsx
useEffect(() => {
    ...
}, []);
```

Calls

```
GET /api/clinics
```

Then stores the clinics inside state.

---

# Booking Form Fields

The form currently contains:

- National ID
- Patient Name
- Phone Number
- Governorate
- Clinic

---

# Governorate

The governorate is fixed in V1.

Displayed to the user as

```
Menoufia
```

The user cannot edit it.

Before submitting:

```js
bookingData.governorate = "Menoufia";
```

Reason:

The first release supports only Menoufia Governorate.

Future versions may support multiple governorates.

---

# National ID Validation

Before sending data to the backend:

```js
/^\d{14}$/
```

Rules

- Only numbers
- Exactly 14 digits

Any invalid value shows a SweetAlert warning.

---

# Phone Validation

Uses the Egyptian mobile number pattern.

```js
/^01[0125]\d{8}$/
```

Examples

Valid

```
010xxxxxxxx
011xxxxxxxx
012xxxxxxxx
015xxxxxxxx
```

Invalid

```
021...
014...
013...
```

---

# Input Restrictions

National ID

```jsx
maxLength={14}
inputMode="numeric"
```

Phone Number

```jsx
maxLength={11}
inputMode="numeric"
```

Both fields remove non-digit characters while typing.

```js
.replace(/\D/g, "")
```

---

# Submit Flow

When the user clicks

```
Submit Request
```

The page:

1. Prevents page refresh.
2. Reads form values.
3. Removes unwanted characters.
4. Adds governorate.
5. Validates National ID.
6. Validates Phone Number.
7. Sends POST request.
8. Shows success or failure message.

---

# API Used

Load Clinics

```
GET /api/clinics
```

Submit Booking

```
POST /api/bookings
```

---

# Success Flow

If booking creation succeeds:

- Success SweetAlert appears.
- Form resets.
- User is redirected to

```
Check Booking Status
```

using

```jsx
setActiveTab("status")
```

---

# Error Flow

If the backend returns an error:

SweetAlert displays the backend message.

Example

```
Duplicate booking
```

or

```
Validation failed
```

---

# Current V1 Limitations

Current version does NOT include:

- Upload National ID image
- React Hook Form
- Axios Instance
- Reusable Input Components
- Multiple Governorates
- Booking Date Selection
- Client-side duplicate checking

These features are planned for future versions.

---

# Future Improvements (V2)

Planned improvements:

- Upload National ID image using Multer.
- React Hook Form.
- Zod Validation.
- Axios Global Instance.
- Reusable Form Components.
- Better Loading Skeletons.
- Better Error Handling.
- Localization.
- Better Accessibility.

---

# Booking Workflow

Patient

↓

Open Booking Form

↓

Load Clinics

↓

Fill Information

↓

Client Validation

↓

POST /api/bookings

↓

Booking Created

↓

Status = Pending

↓

Redirect to Check Booking Status

↓

Wait for Data Entry Review

↓

Approved

↓

Queue Number Generated

OR

Rejected