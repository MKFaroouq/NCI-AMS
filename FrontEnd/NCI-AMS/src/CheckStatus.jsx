import { useState } from "react";
import Swal from "sweetalert2";
import { checkBookingStatus } from "./api/bookingApi";

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
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#16a34a";

      case "pending":
        return "#ca8a04";

      case "rejected":
        return "#dc2626";

      case "exported":
        return "#2563eb";

      default:
        return "#64748b";
    }
  };

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
            <div
              key={booking._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "18px",
                marginBottom: "18px",
              }}
            >
              <h3>{booking.patientName}</h3>

              <p>
                <strong>Clinic:</strong>{" "}
                {booking.clinicId?.name}
              </p>

              <p>
                <strong>Booking Date:</strong>{" "}
                {new Date(
                  booking.bookingDate
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: getStatusColor(
                      booking.status
                    ),
                    fontWeight: "bold",
                  }}
                >
                  {booking.status}
                </span>
              </p>

              {booking.status ===
                "approved" && (
                <>
                  <p>
                    <strong>
                      Queue Number:
                    </strong>{" "}
                    {booking.queueNumber}
                  </p>

                  {booking.qrCode && (
                    <img
                      src={booking.qrCode}
                      alt="QR Code"
                      width={150}
                    />
                  )}
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