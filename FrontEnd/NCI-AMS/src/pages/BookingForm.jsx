import React, { useEffect, useState } from "react";
import logo from "../assets/mciLogo.png";
import CheckStatus from "./CheckStatus";
import Swal from "sweetalert2";
import { createBooking, getClinics } from "../api/bookingApi";

const BookingForm = () => {
  // =========================
  // UI State
  // =========================
  const [activeTab, setActiveTab] = useState("booking");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================
  // Clinics State
  // =========================
  const [clinics, setClinics] = useState([]);
  const [clinicsLoading, setClinicsLoading] = useState(true);
  const [clinicsError, setClinicsError] = useState("");

  // =========================
  // Load Clinics
  // =========================
  useEffect(() => {
    async function loadClinics() {
      try {
        const data = await getClinics();
        setClinics(data);
      } catch (error) {
        setClinicsError(error.message);
      } finally {
        setClinicsLoading(false);
      }
    }

    loadClinics();
  }, []);

  // =========================
  // Submit Booking
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = Object.fromEntries(new FormData(e.target));

    // Remove any non-digit characters
    bookingData.phoneNumber = bookingData.phoneNumber.replace(/\D/g, "");
    bookingData.nationalId = bookingData.nationalId.replace(/\D/g, "");

    //Governorate = "Menoufia" because the API requires it, but we don't want the user to change it.
    // because it's only for Menoufia governorate now , so we set it here in the code.
    //Governorate = "Menoufia" because the API requires it, but we don't want the user to change it.
    // because it's only for Menoufia governorate now , so we set it here in the code.
    bookingData.governorate = "Menoufia";

    // console.log(bookingData);

    // =========================
    // Validation
    // =========================
    
    // National ID Validation
    if (!/^\d{14}$/.test(bookingData.nationalId)) {
      Swal.fire({
        title:"National ID Not Valid",
        text: "The national ID must consist of 14 digits.",
        icon: "warning",
        confirmButtonText: "Got it",
        confirmButtonColor: "#d97706",
      });

      
    
    return;
    }

    // Phone Number Validation
        if (!/^01[0125]\d{8}$/.test(bookingData.phoneNumber)) {
        Swal.fire({
            title: "Phone Number Not Valid",
            text: "Please enter a valid Egyptian mobile number.",
            icon: "warning",
            confirmButtonText: "Got it",
            confirmButtonColor: "#d97706",
        });

        
    return;
    } 

    setIsSubmitting(true);

    try {
    // console.log(bookingData);
      await createBooking(bookingData);

      Swal.fire({
        title: "Booking Request Submitted",
        text: "Your booking request has been successfully submitted. You can now check your booking status.",
        icon: "success",
        confirmButtonText: "Got it",
        confirmButtonColor: "#0c2340",
      });

      e.target.reset();

      setActiveTab("status");
    } catch (error) {
      Swal.fire({
        title: "Failed to Submit Booking Request",
        text: error.message,
        icon: "error",
        confirmButtonText: "Got it",
        confirmButtonColor: "#dc2626",
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

          <span className="logo-text">
            معهد الأورام - جامعة المنوفية
          </span>
        </div>

        <button
          type="button"
          className={`toggle-btn ${
            activeTab === "status" ? "status-mode" : ""
          }`}
          onClick={() =>
            setActiveTab(
              activeTab === "booking" ? "status" : "booking"
            )
          }
        >
          {activeTab === "booking"
            ? "Check Booking Status"
            : "Back to Booking Form"}
        </button>
      </header>

      <main className="main-content">
        <div className="login-card">
          {activeTab === "booking" ? (
            <>
              <h2 className="card-title">New Booking</h2>

              <p className="card-subtitle">
                Please enter the required information.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nationalId">
                    National ID
                  </label>

                  <input
                    type="text"
                    id="nationalId"
                    name="nationalId"
                    maxLength={14}
                    className="form-control"
                    inputMode="numeric"
                    placeholder="Enter National ID"
                    disabled={isSubmitting}
                    onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");
                    }}                   
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="patientName">
                    Patient Name
                  </label>

                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    className="form-control"
                    placeholder="Full Name"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    inputMode="numeric"
                    className="form-control ltr-input"
                    placeholder="01xxxxxxxxx"
                    maxLength={11}
                    disabled={isSubmitting}
                    onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="governorate">
                    Governorate
                  </label>

                  <input
                    type="text"
                    id="governorate"
                    value="Menoufia"
                    className="form-control"
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="clinicId">
                    Clinic
                  </label>

                  {clinicsLoading ? (
                    <p>Loading clinics...</p>
                  ) : clinicsError ? (
                    <p style={{ color: "#dc2626" }}>
                      {clinicsError}
                    </p>
                  ) : (
                    <select
                      id="clinicId"
                      name="clinicId"
                      className="form-control select-custom"
                      defaultValue=""
                      disabled={isSubmitting}
                      required
                    >
                      <option value="" disabled>
                        Select Clinic
                      </option>

                      {clinics.map((clinic) => (
                        <option
                          key={clinic._id}
                          value={clinic._id}
                        >
                          {clinic.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : "Submit Request"}
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
          <h3 className="footer-title">
            معهد الأورام - جامعة المنوفية
          </h3>

          <p className="footer-subtitle">
            مدينة شبين الكوم - محافظة المنوفية - مصر
          </p>
        </div>

        <div className="footer-copyright">
          معهد الأورام - جميع الحقوق محفوظة © 2026
        </div>
      </footer>
    </div>
  );
}

export default BookingForm;