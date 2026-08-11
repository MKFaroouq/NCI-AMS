import { useState } from "react";
import Swal from "sweetalert2";
import { checkBookingStatus } from "../api/bookingApi";

const CheckStatus = () => {
  // =========================
  // State
  // =========================
  const [nationalId, setNationalId] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedNationalId = nationalId.replace(/\D/g, "");

    if (!/^\d{14}$/.test(cleanedNationalId)) {
      Swal.fire({
        title: "Invalid National ID",
        text: "National ID must contain exactly 14 digits.",
        icon: "warning",
      });

      return;
    }

    setLoading(true);

    try {
      const data = await checkBookingStatus(cleanedNationalId);

      setBookings(data.bookings);
    } catch (error) {
      Swal.fire({
        title: "No Bookings Found",
        text: error.message,
        icon: "error",
      });

      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Status Badge Color
  // =========================
  const statusMap = {
    pending: {
      text: "Pending Review",
      color: "#f59e0b",
    },
    approved: {
      text: "Approved",
      color: "#22c55e",
    },
    rejected: {
      text: "Rejected",
      color: "#ef4444",
    },
    exported: {
      // المريض يشوفها Approved مش Exported
      text: "Approved",
      color: "#22c55e",
    },
  };
  /* // old code using switch statement
  const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "#16a34a";

    case "exported":
      return "#16a34a";

    case "pending":
      return "#ca8a04";

    case "rejected":
      return "#dc2626";

    default:
      return "#64748b";
  }
};
*/

  return (
    <>
      <h2 className="card-title">
        Check Booking Status
      </h2>

      <p className="card-subtitle">
        Enter your National ID.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">

          <label htmlFor="nationalId">
            National ID
          </label>

          <input
            id="nationalId"
            type="text"
            className="form-control"
            placeholder="Enter National ID"
            value={nationalId}
            maxLength={14}
            inputMode="numeric"
            onChange={(e) =>
              setNationalId(
                e.target.value.replace(/\D/g, "")
              )
            }
            required
          />

        </div>

        <button
          className="submit-btn"
          disabled={loading}
        >
          {loading
            ? "Searching..."
            : "Check Status"}
        </button>
      </form>

      {/* ========================= */}
      {/* Results */}
      {/* ========================= */}

      {bookings.length > 0 && (
        <div
          style={{
            marginTop: "30px",
          }}
        >
          {bookings.map((booking) => (
              <div className="booking-card" key={booking._id}>
              <h3>{booking.patientName}</h3>

              <div className="booking-row">
                  <span>Clinic</span>
                  <strong>{booking.clinicId?.name}</strong>
              </div>

            <div className="booking-row">
                <span>Booking Date</span>

                <strong>
                    {new Date(
                        booking.bookingDate
                    ).toLocaleDateString("en-GB")}
                </strong>
            </div>

              <div className="status-row">
                <span>Status</span>

                <span
                  className="status-badge"
                  style={{
                    backgroundColor: statusMap[booking.status]?.color,
                  }}
                >
                  {booking.status === "pending"}
                  {(booking.status === "approved" ||
                    booking.status === "exported")}
                  {booking.status === "rejected"}

                  {statusMap[booking.status]?.text}
                </span>
              </div>

              {booking.status ===
                "approved" || booking.status === "exported" &&  (
                <>

                  {/* =========================
                      V2 Feature
                      QR Code will be added after
                      implementing ticket generation.
                  ========================= */}         
                         
                {/* <div className="booking-row">
                    <span>Queue Number</span>
                    <strong>#{booking.queueNumber}</strong>
                </div>

                <div className="qr-container">
                    <img
                        src={booking.qrCode}
                        alt="QR Code"
                        className="qr-image"
                    />
                </div> */}
                </>
              )}

              {booking.status ===
                "rejected" && (
                <p
                  style={{
                    color: "#dc2626",
                  }}
                >
                  <strong>
                    Rejection Reason:
                  </strong>{" "}
                  {booking.rejectionReason ||
                    "No reason provided"}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      
    </>
  );
};

export default CheckStatus;