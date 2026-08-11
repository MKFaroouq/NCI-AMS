// import React, { useMemo, useState } from "react";
// import Swal from "sweetalert2";

// const DataEntryDashboard = () => {
//   // =========================
//   // Temporary Mock Data
//   // هنستبدلها بالـ API بعد تثبيت الـ UI
//   // =========================
//   const [bookings, setBookings] = useState([
//     {
//       _id: "1",
//       patientName: "Ahmed Mohamed",
//       nationalId: "30006208801034",
//       phoneNumber: "01205642728",
//       governorate: "Menoufia",
//       bookingDate: "2026-08-08",
//       status: "pending",
//       clinicId: {
//         _id: "clinic1",
//         name: "Surgical Oncology",
//       },
//       createdAt: "2026-08-08T08:30:00",
//     },
//     {
//       _id: "2",
//       patientName: "Mohamed Ali",
//       nationalId: "29901011234567",
//       phoneNumber: "01012345678",
//       governorate: "Menoufia",
//       bookingDate: "2026-08-08",
//       status: "pending",
//       clinicId: {
//         _id: "clinic2",
//         name: "Medical Oncology",
//       },
//       createdAt: "2026-08-08T09:15:00",
//     },
//     {
//       _id: "3",
//       patientName: "Sara Hassan",
//       nationalId: "30105251234567",
//       phoneNumber: "01123456789",
//       governorate: "Menoufia",
//       bookingDate: "2026-08-08",
//       status: "pending",
//       clinicId: {
//         _id: "clinic1",
//         name: "Surgical Oncology",
//       },
//       createdAt: "2026-08-08T10:00:00",
//     },
//   ]);

//   // =========================
//   // UI State
//   // =========================
//   const [search, setSearch] = useState("");
//   const [clinicFilter, setClinicFilter] = useState("all");
//   const [loading, setLoading] = useState(false);

//   // =========================
//   // Pending Requests
//   // =========================
//   const pendingBookings = useMemo(() => {
//     return bookings.filter(
//       (booking) => booking.status === "pending"
//     );
//   }, [bookings]);

//   // =========================
//   // Clinics
//   // =========================
//   const clinics = useMemo(() => {
//     const uniqueClinics = new Map();

//     bookings.forEach((booking) => {
//       if (booking.clinicId) {
//         uniqueClinics.set(
//           booking.clinicId._id,
//           booking.clinicId.name
//         );
//       }
//     });

//     return Array.from(uniqueClinics.entries());
//   }, [bookings]);

//   // =========================
//   // Search + Filter
//   // =========================
//   const filteredBookings = useMemo(() => {
//     return pendingBookings
//       .filter((booking) => {
//         const searchValue = search.trim();

//         if (!searchValue) {
//           return true;
//         }

//         return (
//           booking.nationalId.includes(searchValue) ||
//           booking.patientName
//             .toLowerCase()
//             .includes(searchValue.toLowerCase())
//         );
//       })
//       .filter((booking) => {
//         if (clinicFilter === "all") {
//           return true;
//         }

//         return booking.clinicId?._id === clinicFilter;
//       })
//       .sort(
//         (a, b) =>
//           new Date(a.createdAt) -
//           new Date(b.createdAt)
//       );
//   }, [
//     pendingBookings,
//     search,
//     clinicFilter,
//   ]);

//   // =========================
//   // Approve
//   // =========================
//   const handleApprove = async (booking) => {
//     const result = await Swal.fire({
//       title: "Approve Booking?",
//       text: `Are you sure you want to approve ${booking.patientName}'s booking?`,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "Approve",
//       cancelButtonText: "Cancel",
//       confirmButtonColor: "#16a34a",
//       cancelButtonColor: "#64748b",
//     });

//     if (!result.isConfirmed) {
//       return;
//     }

//     setLoading(true);

//     try {
//       /*
//        * TODO:
//        * هنا هنستدعي:
//        *
//        * await approveBooking(booking._id);
//        *
//        * بعد توصيل الـ API
//        */

//       // Temporary UI update
//       setBookings((currentBookings) =>
//         currentBookings.map((item) =>
//           item._id === booking._id
//             ? {
//                 ...item,
//                 status: "approved",
//               }
//             : item
//         )
//       );

//       await Swal.fire({
//         title: "Booking Approved",
//         text: "The booking has been approved successfully.",
//         icon: "success",
//         confirmButtonText: "Done",
//         confirmButtonColor: "#0c2340",
//       });
//     } catch (error) {
//       Swal.fire({
//         title: "Approval Failed",
//         text:
//           error.message ||
//           "Something went wrong while approving the booking.",
//         icon: "error",
//         confirmButtonColor: "#dc2626",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // Reject
//   // =========================
//   const handleReject = async (booking) => {
//     const result = await Swal.fire({
//       title: "Reject Booking",
//       text: "Please enter the rejection reason.",
//       input: "textarea",
//       inputPlaceholder: "Enter rejection reason...",
//       inputAttributes: {
//         "aria-label": "Rejection reason",
//       },
//       showCancelButton: true,
//       confirmButtonText: "Reject Booking",
//       cancelButtonText: "Cancel",
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#64748b",
//       inputValidator: (value) => {
//         if (!value || !value.trim()) {
//           return "Rejection reason is required.";
//         }

//         return null;
//       },
//     });

//     if (!result.isConfirmed) {
//       return;
//     }

//     setLoading(true);

//     try {
//       /*
//        * TODO:
//        * هنا هنستدعي:
//        *
//        * await rejectBooking(
//        *   booking._id,
//        *   result.value
//        * );
//        *
//        * بعد توصيل الـ API
//        */

//       // Temporary UI update
//       setBookings((currentBookings) =>
//         currentBookings.map((item) =>
//           item._id === booking._id
//             ? {
//                 ...item,
//                 status: "rejected",
//                 rejectionReason:
//                   result.value,
//               }
//             : item
//         )
//       );

//       await Swal.fire({
//         title: "Booking Rejected",
//         text: "The booking has been rejected successfully.",
//         icon: "success",
//         confirmButtonText: "Done",
//         confirmButtonColor: "#0c2340",
//       });
//     } catch (error) {
//       Swal.fire({
//         title: "Rejection Failed",
//         text:
//           error.message ||
//           "Something went wrong while rejecting the booking.",
//         icon: "error",
//         confirmButtonColor: "#dc2626",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // Format Date
//   // =========================
//   const formatDate = (date) => {
//     if (!date) {
//       return "-";
//     }

//     return new Date(date).toLocaleDateString(
//       "en-GB"
//     );
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#f8fafc",
//         padding: "30px",
//         fontFamily:
//           "Arial, Helvetica, sans-serif",
//         direction: "ltr",
//       }}
//     >
//       {/* =========================
//           Header
//       ========================= */}
//       <header
//         style={{
//           maxWidth: "1200px",
//           margin: "0 auto 30px",
//           background: "#0c2340",
//           color: "#fff",
//           padding: "24px 28px",
//           borderRadius: "14px",
//           boxShadow:
//             "0 8px 25px rgba(15, 23, 42, 0.12)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: "20px",
//         }}
//       >
//         <div>
//           <h1
//             style={{
//               margin: 0,
//               fontSize: "26px",
//             }}
//           >
//             NCI-Q Data Entry Dashboard
//           </h1>

//           <p
//             style={{
//               margin:
//                 "8px 0 0",
//               color: "#cbd5e1",
//               fontSize: "14px",
//             }}
//           >
//             Manage and review patient
//             booking requests
//           </p>
//         </div>

//         <div
//           style={{
//             background: "#fff",
//             color: "#0c2340",
//             padding: "12px 18px",
//             borderRadius: "10px",
//             textAlign: "center",
//             minWidth: "110px",
//           }}
//         >
//           <div
//             style={{
//               fontSize: "12px",
//               color: "#64748b",
//               marginBottom: "4px",
//             }}
//           >
//             Pending Requests
//           </div>

//           <strong
//             style={{
//               fontSize: "24px",
//             }}
//           >
//             {pendingBookings.length}
//           </strong>
//         </div>
//       </header>

//       {/* =========================
//           Main
//       ========================= */}
//       <main
//         style={{
//           maxWidth: "1200px",
//           margin: "0 auto",
//         }}
//       >
//         {/* =========================
//             Filters
//         ========================= */}
//         <section
//           style={{
//             background: "#fff",
//             padding: "20px",
//             borderRadius: "12px",
//             marginBottom: "20px",
//             border:
//               "1px solid #e2e8f0",
//             boxShadow:
//               "0 4px 12px rgba(15, 23, 42, 0.04)",
//           }}
//         >
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns:
//                 "2fr 1fr",
//               gap: "15px",
//             }}
//           >
//             {/* Search */}
//             <div>
//               <label
//                 style={{
//                   display: "block",
//                   fontSize: "13px",
//                   fontWeight: "bold",
//                   color: "#475569",
//                   marginBottom: "7px",
//                 }}
//               >
//                 Search Patient
//               </label>

//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) =>
//                   setSearch(e.target.value)
//                 }
//                 placeholder="Search by National ID or patient name..."
//                 style={{
//                   width: "100%",
//                   boxSizing: "border-box",
//                   padding:
//                     "12px 14px",
//                   border:
//                     "1px solid #cbd5e1",
//                   borderRadius: "8px",
//                   outline: "none",
//                   fontSize: "14px",
//                 }}
//               />
//             </div>

//             {/* Clinic Filter */}
//             <div>
//               <label
//                 style={{
//                   display: "block",
//                   fontSize: "13px",
//                   fontWeight: "bold",
//                   color: "#475569",
//                   marginBottom: "7px",
//                 }}
//               >
//                 Filter by Clinic
//               </label>

//               <select
//                 value={clinicFilter}
//                 onChange={(e) =>
//                   setClinicFilter(
//                     e.target.value
//                   )
//                 }
//                 style={{
//                   width: "100%",
//                   padding:
//                     "12px 14px",
//                   border:
//                     "1px solid #cbd5e1",
//                   borderRadius: "8px",
//                   background: "#fff",
//                   fontSize: "14px",
//                   cursor: "pointer",
//                 }}
//               >
//                 <option value="all">
//                   All Clinics
//                 </option>

//                 {clinics.map(
//                   ([id, name]) => (
//                     <option
//                       key={id}
//                       value={id}
//                     >
//                       {name}
//                     </option>
//                   )
//                 )}
//               </select>
//             </div>
//           </div>
//         </section>

//         {/* =========================
//             Results Header
//         ========================= */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent:
//               "space-between",
//             alignItems: "center",
//             marginBottom: "15px",
//           }}
//         >
//           <h2
//             style={{
//               margin: 0,
//               fontSize: "20px",
//               color: "#0f172a",
//             }}
//           >
//             Pending Booking Requests
//           </h2>

//           <span
//             style={{
//               color: "#64748b",
//               fontSize: "14px",
//             }}
//           >
//             Showing{" "}
//             {filteredBookings.length}{" "}
//             request(s)
//           </span>
//         </div>

//         {/* =========================
//             Empty State
//         ========================= */}
//         {filteredBookings.length === 0 && (
//           <div
//             style={{
//               background: "#fff",
//               border:
//                 "1px solid #e2e8f0",
//               borderRadius: "12px",
//               padding: "50px 20px",
//               textAlign: "center",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: "42px",
//                 marginBottom: "12px",
//               }}
//             >
//               ✓
//             </div>

//             <h3
//               style={{
//                 margin:
//                   "0 0 8px",
//                 color: "#0f172a",
//               }}
//             >
//               No Pending Requests
//             </h3>

//             <p
//               style={{
//                 margin: 0,
//                 color: "#64748b",
//               }}
//             >
//               There are no booking
//               requests matching your
//               search.
//             </p>
//           </div>
//         )}

//         {/* =========================
//             Booking Cards
//         ========================= */}
//         <div
//           style={{
//             display: "grid",
//             gap: "16px",
//           }}
//         >
//           {filteredBookings.map(
//             (booking) => (
//               <div
//                 key={booking._id}
//                 style={{
//                   background: "#fff",
//                   border:
//                     "1px solid #e2e8f0",
//                   borderRadius: "14px",
//                   padding: "22px",
//                   boxShadow:
//                     "0 4px 15px rgba(15, 23, 42, 0.05)",
//                 }}
//               >
//                 {/* Card Header */}
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent:
//                       "space-between",
//                     alignItems:
//                       "flex-start",
//                     gap: "15px",
//                     marginBottom:
//                       "20px",
//                   }}
//                 >
//                   <div>
//                     <h3
//                       style={{
//                         margin: 0,
//                         color:
//                           "#0f172a",
//                         fontSize:
//                           "19px",
//                       }}
//                     >
//                       {
//                         booking.patientName
//                       }
//                     </h3>

//                     <p
//                       style={{
//                         margin:
//                           "6px 0 0",
//                         color:
//                           "#64748b",
//                         fontSize:
//                           "13px",
//                       }}
//                     >
//                       Request ID:{" "}
//                       {booking._id}
//                     </p>
//                   </div>

//                   <span
//                     style={{
//                       background:
//                         "#fef3c7",
//                       color:
//                         "#b45309",
//                       padding:
//                         "6px 12px",
//                       borderRadius:
//                         "20px",
//                       fontSize:
//                         "12px",
//                       fontWeight:
//                         "bold",
//                     }}
//                   >
//                     Pending Review
//                   </span>
//                 </div>

//                 {/* Patient Information */}
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns:
//                       "repeat(2, 1fr)",
//                     gap: "12px",
//                     marginBottom:
//                       "20px",
//                   }}
//                 >
//                   <InfoItem
//                     label="National ID"
//                     value={
//                       booking.nationalId
//                     }
//                   />

//                   <InfoItem
//                     label="Phone Number"
//                     value={
//                       booking.phoneNumber
//                     }
//                   />

//                   <InfoItem
//                     label="Clinic"
//                     value={
//                       booking
//                         .clinicId
//                         ?.name ||
//                       "-"
//                     }
//                   />

//                   <InfoItem
//                     label="Booking Date"
//                     value={formatDate(
//                       booking.bookingDate
//                     )}
//                   />

//                   <InfoItem
//                     label="Governorate"
//                     value={
//                       booking.governorate ||
//                       "Menoufia"
//                     }
//                   />

//                   <InfoItem
//                     label="Submitted At"
//                     value={formatDate(
//                       booking.createdAt
//                     )}
//                   />
//                 </div>

//                 {/* Actions */}
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: "10px",
//                     borderTop:
//                       "1px solid #e2e8f0",
//                     paddingTop:
//                       "18px",
//                   }}
//                 >
//                   <button
//                     type="button"
//                     onClick={() =>
//                       handleApprove(
//                         booking
//                       )
//                     }
//                     disabled={loading}
//                     style={{
//                       flex: 1,
//                       border: "none",
//                       borderRadius:
//                         "8px",
//                       padding:
//                         "12px",
//                       background:
//                         "#16a34a",
//                       color: "#fff",
//                       fontWeight:
//                         "bold",
//                       cursor:
//                         loading
//                           ? "not-allowed"
//                           : "pointer",
//                       opacity:
//                         loading
//                           ? 0.7
//                           : 1,
//                     }}
//                   >
//                     ✓ Approve
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() =>
//                       handleReject(
//                         booking
//                       )
//                     }
//                     disabled={loading}
//                     style={{
//                       flex: 1,
//                       border: "none",
//                       borderRadius:
//                         "8px",
//                       padding:
//                         "12px",
//                       background:
//                         "#dc2626",
//                       color: "#fff",
//                       fontWeight:
//                         "bold",
//                       cursor:
//                         loading
//                           ? "not-allowed"
//                           : "pointer",
//                       opacity:
//                         loading
//                           ? 0.7
//                           : 1,
//                     }}
//                   >
//                     ✕ Reject
//                   </button>
//                 </div>
//               </div>
//             )
//           )}
//         </div>
//       </main>
//     </div>
//   );


// // =========================
// // Small Info Component
// // =========================
// const InfoItem = ({
//   label,
//   value,
// }) => {
//   return (
//     <div
//       style={{
//         background: "#f8fafc",
//         padding: "11px 13px",
//         borderRadius: "8px",
//       }}
//     >
//       <div
//         style={{
//           fontSize: "11px",
//           color: "#64748b",
//           marginBottom: "4px",
//         }}
//       >
//         {label}
//       </div>

//       <div
//         style={{
//           fontSize: "14px",
//           color: "#0f172a",
//           fontWeight: "600",
//           wordBreak: "break-word",
//         }}
//       >
//         {value}
//       </div>
//     </div>
//   );
// };
// }
// export default DataEntryDashboard



// import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";

// const DataEntryDashboard = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // =========================
//   // Get Bookings
//   // =========================
//   const getBookings = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch(
//         "http://localhost:8000/api/bookings",
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.error || "Failed to get bookings"
//         );
//       }

//       setBookings(data.data?.bookings || []);
//     } catch (error) {
//       console.error("Get Bookings Error:", error);

//       Swal.fire({
//         title: "Error",
//         text: error.message,
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // Load Bookings
//   // =========================
//   useEffect(() => {
//     getBookings();
//   }, []);

//   // =========================
//   // Approve Booking
//   // =========================
//   const handleApprove = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token");

//       const result = await Swal.fire({
//         title: "Approve Booking?",
//         text: "Are you sure you want to approve this booking?",
//         icon: "question",
//         showCancelButton: true,
//         confirmButtonText: "Yes, Approve",
//         cancelButtonText: "Cancel",
//         confirmButtonColor: "#16a34a",
//       });

//       if (!result.isConfirmed) {
//         return;
//       }

//       const response = await fetch(
//         `http://localhost:8000/api/bookings/${bookingId}/approve`,
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.error || "Failed to approve booking"
//         );
//       }

//       Swal.fire({
//         title: "Approved",
//         text: "Booking approved successfully.",
//         icon: "success",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       // Refresh bookings
//       getBookings();
//     } catch (error) {
//       console.error("Approve Error:", error);

//       Swal.fire({
//         title: "Error",
//         text: error.message,
//         icon: "error",
//       });
//     }
//   };

//   // =========================
//   // Reject Booking
//   // =========================
//   const handleReject = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token");

//       const result = await Swal.fire({
//         title: "Reject Booking?",
//         text: "Are you sure you want to reject this booking?",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, Reject",
//         cancelButtonText: "Cancel",
//         confirmButtonColor: "#dc2626",
//       });

//       if (!result.isConfirmed) {
//         return;
//       }

//       const response = await fetch(
//         `http://localhost:8000/api/bookings/${bookingId}/reject`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.error || "Failed to reject booking"
//         );
//       }

//       Swal.fire({
//         title: "Rejected",
//         text: "Booking rejected successfully.",
//         icon: "success",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       // Refresh bookings
//       getBookings();
//     } catch (error) {
//       console.error("Reject Error:", error);

//       Swal.fire({
//         title: "Error",
//         text: error.message,
//         icon: "error",
//       });
//     }
//   };

//   // =========================
//   // Logout
//   // =========================
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//   };

//   // =========================
//   // Status
//   // =========================
//   const getStatus = (status) => {
//     if (status === "approved") {
//       return {
//         text: "Approved",
//         className: "status-approved",
//       };
//     }

//     if (status === "rejected") {
//       return {
//         text: "Rejected",
//         className: "status-rejected",
//       };
//     }

//     if (status === "exported") {
//       return {
//         text: "Exported",
//         className: "status-exported",
//       };
//     }

//     return {
//       text: "Pending",
//       className: "status-pending",
//     };
//   };

//   return (
//     <div className="data-entry-page" dir="ltr">

//       {/* ========================= */}
//       {/* Header */}
//       {/* ========================= */}

//       <header className="data-entry-header">

//         <div>
//           <h2>Data Entry Dashboard</h2>

//           <p>
//             Manage patient booking requests
//           </p>
//         </div>

//         <button
//           type="button"
//           className="logout-btn"
//           onClick={handleLogout}
//         >
//           Logout
//         </button>

//       </header>

//       {/* ========================= */}
//       {/* Main */}
//       {/* ========================= */}

//       <main className="data-entry-main">

//         <div className="dashboard-title">

//           <div>
//             <h1>Booking Requests</h1>

//             <p>
//               Review and manage patient requests
//             </p>
//           </div>

//           <div className="booking-count">
//             {bookings.length} Requests
//           </div>

//         </div>

//         {/* ========================= */}
//         {/* Loading */}
//         {/* ========================= */}

//         {loading && (
//           <div className="empty-box">
//             <p>Loading bookings...</p>
//           </div>
//         )}

//         {/* ========================= */}
//         {/* No Bookings */}
//         {/* ========================= */}

//         {!loading && bookings.length === 0 && (
//           <div className="empty-box">
//             <h3>No Booking Requests</h3>

//             <p>
//               There are currently no booking requests.
//             </p>
//           </div>
//         )}

//         {/* ========================= */}
//         {/* Booking Cards */}
//         {/* ========================= */}

//         {!loading && bookings.length > 0 && (
//           <div className="booking-grid">

//             {bookings.map((booking) => {

//               const status = getStatus(
//                 booking.status
//               );

//               return (
//                 <details
//                   className="booking-card"
//                   key={booking._id}
//                 >

//                   {/* ========================= */}
//                   {/* Card Header */}
//                   {/* ========================= */}

//                   <summary className="booking-card-header">

//                     <div className="patient-info">

//                       <div className="patient-avatar">
//                         {booking.patientName
//                           ?.charAt(0)
//                           ?.toUpperCase()}
//                       </div>

//                       <div>
//                         <h3>
//                           {booking.patientName}
//                         </h3>

//                         <p>
//                           ID: {booking.nationalId}
//                         </p>
//                       </div>

//                     </div>

//                     <span
//                       className={`status-badge ${status.className}`}
//                     >
//                       {status.text}
//                     </span>

//                   </summary>

//                   {/* ========================= */}
//                   {/* Card Details */}
//                   {/* ========================= */}

//                   <div className="booking-card-details">

//                     <div className="details-grid">

//                       <div className="detail-item">
//                         <span>
//                           National ID
//                         </span>

//                         <strong>
//                           {booking.nationalId}
//                         </strong>
//                       </div>

//                       <div className="detail-item">
//                         <span>
//                           Phone
//                         </span>

//                         <strong>
//                           {booking.phoneNumber ||
//                             "N/A"}
//                         </strong>
//                       </div>

//                       <div className="detail-item">
//                         <span>
//                           Clinic
//                         </span>

//                         <strong>
//                           {booking.clinicId?.name ||
//                             "Unknown"}
//                         </strong>
//                       </div>

//                       <div className="detail-item">
//                         <span>
//                           Booking Date
//                         </span>

//                         <strong>
//                           {booking.bookingDate
//                             ? new Date(
//                                 booking.bookingDate
//                               ).toLocaleDateString(
//                                 "en-GB"
//                               )
//                             : "N/A"}
//                         </strong>
//                       </div>

//                       <div className="detail-item">
//                         <span>
//                           Current Status
//                         </span>

//                         <strong>
//                           {status.text}
//                         </strong>
//                       </div>

//                       <div className="detail-item">
//                         <span>
//                           Created
//                         </span>

//                         <strong>
//                           {booking.createdAt
//                             ? new Date(
//                                 booking.createdAt
//                               ).toLocaleDateString(
//                                 "en-GB"
//                               )
//                             : "N/A"}
//                         </strong>
//                       </div>

//                     </div>

//                     {/* ========================= */}
//                     {/* Actions */}
//                     {/* ========================= */}

//                     {booking.status === "pending" && (
//                       <div className="booking-actions">

//                         <button
//                           type="button"
//                           className="approve-btn"
//                           onClick={() =>
//                             handleApprove(
//                               booking._id
//                             )
//                           }
//                         >
//                           ✓ Approve
//                         </button>

//                         <button
//                           type="button"
//                           className="reject-btn"
//                           onClick={() =>
//                             handleReject(
//                               booking._id
//                             )
//                           }
//                         >
//                           ✕ Reject
//                         </button>

//                       </div>
//                     )}

//                     {/* ========================= */}
//                     {/* Approved Information */}
//                     {/* ========================= */}

//                     {booking.status === "approved" && (
//                       <div className="approved-info">

//                         <strong>
//                           Queue Number
//                         </strong>

//                         <span>
//                           #
//                           {booking.queueNumber ||
//                             "Not assigned"}
//                         </span>

//                       </div>
//                     )}

//                     {/* ========================= */}
//                     {/* Rejected Information */}
//                     {/* ========================= */}

//                     {booking.status === "rejected" && (
//                       <div className="rejected-info">

//                         <strong>
//                           Rejection Reason
//                         </strong>

//                         <span>
//                           {booking.rejectionReason ||
//                             "No reason provided"}
//                         </span>

//                       </div>
//                     )}

//                   </div>

//                 </details>
//               );
//             })}

//           </div>
//         )}

//       </main>

//       {/* ========================= */}
//       {/* Page CSS */}
//       {/* ========================= */}

//       <style>{`

//         .data-entry-page {
//           min-height: 100vh;
//           background: #f5f7fb;
//           color: #1e293b;
//           font-family: Arial, sans-serif;
//         }

//         .data-entry-header {
//           background: #0c2340;
//           color: white;
//           padding: 18px 40px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           box-shadow: 0 2px 10px rgba(0,0,0,0.08);
//         }

//         .data-entry-header h2 {
//           margin: 0;
//           font-size: 21px;
//         }

//         .data-entry-header p {
//           margin: 5px 0 0;
//           color: #cbd5e1;
//           font-size: 13px;
//         }

//         .logout-btn {
//           border: none;
//           background: #ffffff;
//           color: #0c2340;
//           padding: 9px 18px;
//           border-radius: 7px;
//           cursor: pointer;
//           font-weight: bold;
//         }

//         .logout-btn:hover {
//           background: #e2e8f0;
//         }

//         .data-entry-main {
//           max-width: 1300px;
//           margin: auto;
//           padding: 35px;
//         }

//         .dashboard-title {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 30px;
//         }

//         .dashboard-title h1 {
//           margin: 0;
//           font-size: 28px;
//           color: #0f172a;
//         }

//         .dashboard-title p {
//           margin-top: 7px;
//           color: #64748b;
//         }

//         .booking-count {
//           background: #ffffff;
//           border: 1px solid #e2e8f0;
//           padding: 10px 16px;
//           border-radius: 8px;
//           font-weight: bold;
//           color: #0c2340;
//         }

//         .booking-grid {
//           display: grid;
//           grid-template-columns:
//             repeat(auto-fill, minmax(340px, 1fr));
//           gap: 20px;
//           align-items: start;
//         }

//         .booking-card {
//           background: #ffffff;
//           border: 1px solid #e2e8f0;
//           border-radius: 12px;
//           overflow: hidden;
//           box-shadow:
//             0 3px 10px rgba(15,23,42,0.05);
//           transition: 0.2s;
//         }

//         .booking-card:hover {
//           transform: translateY(-2px);
//           box-shadow:
//             0 8px 20px rgba(15,23,42,0.09);
//         }

//         .booking-card[open] {
//           grid-column: span 1;
//         }

//         .booking-card-header {
//           list-style: none;
//           cursor: pointer;
//           padding: 20px;
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           gap: 15px;
//         }

//         .booking-card-header::-webkit-details-marker {
//           display: none;
//         }

//         .patient-info {
//           display: flex;
//           gap: 12px;
//           align-items: center;
//         }

//         .patient-avatar {
//           width: 44px;
//           height: 44px;
//           border-radius: 50%;
//           background: #e8eef7;
//           color: #0c2340;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: bold;
//           font-size: 18px;
//         }

//         .patient-info h3 {
//           margin: 0 0 5px;
//           font-size: 16px;
//           color: #0f172a;
//         }

//         .patient-info p {
//           margin: 0;
//           color: #64748b;
//           font-size: 12px;
//         }

//         .status-badge {
//           padding: 5px 9px;
//           border-radius: 20px;
//           font-size: 11px;
//           font-weight: bold;
//           white-space: nowrap;
//         }

//         .status-pending {
//           background: #fef3c7;
//           color: #b45309;
//         }

//         .status-approved {
//           background: #dcfce7;
//           color: #15803d;
//         }

//         .status-rejected {
//           background: #fee2e2;
//           color: #b91c1c;
//         }

//         .status-exported {
//           background: #e0e7ff;
//           color: #4338ca;
//         }

//         .booking-card-details {
//           border-top: 1px solid #e2e8f0;
//           padding: 20px;
//         }

//         .details-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 16px;
//         }

//         .detail-item {
//           display: flex;
//           flex-direction: column;
//           gap: 5px;
//         }

//         .detail-item span {
//           color: #94a3b8;
//           font-size: 11px;
//         }

//         .detail-item strong {
//           color: #334155;
//           font-size: 13px;
//         }

//         .booking-actions {
//           display: flex;
//           gap: 10px;
//           margin-top: 22px;
//           padding-top: 18px;
//           border-top: 1px solid #e2e8f0;
//         }

//         .approve-btn,
//         .reject-btn {
//           flex: 1;
//           border: none;
//           padding: 11px;
//           border-radius: 7px;
//           cursor: pointer;
//           font-weight: bold;
//           font-size: 13px;
//           transition: 0.2s;
//         }

//         .approve-btn {
//           background: #16a34a;
//           color: white;
//         }

//         .approve-btn:hover {
//           background: #15803d;
//         }

//         .reject-btn {
//           background: #fee2e2;
//           color: #b91c1c;
//         }

//         .reject-btn:hover {
//           background: #fecaca;
//         }

//         .approved-info,
//         .rejected-info {
//           margin-top: 20px;
//           padding: 14px;
//           border-radius: 8px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .approved-info {
//           background: #f0fdf4;
//           color: #166534;
//         }

//         .approved-info span {
//           font-size: 22px;
//           font-weight: bold;
//         }

//         .rejected-info {
//           background: #fef2f2;
//           color: #991b1b;
//           flex-direction: column;
//           align-items: flex-start;
//           gap: 5px;
//         }

//         .empty-box {
//           background: white;
//           border: 1px solid #e2e8f0;
//           border-radius: 12px;
//           padding: 60px 20px;
//           text-align: center;
//           color: #64748b;
//         }

//         @media (max-width: 700px) {

//           .data-entry-header {
//             padding: 15px 20px;
//           }

//           .data-entry-main {
//             padding: 20px;
//           }

//           .dashboard-title {
//             align-items: flex-start;
//             flex-direction: column;
//             gap: 15px;
//           }

//           .booking-grid {
//             grid-template-columns: 1fr;
//           }

//           .details-grid {
//             grid-template-columns: 1fr;
//           }

//         }

//       `}</style>

//     </div>
//   );
// };

// export default DataEntryDashboard;



// import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";

// const DataEntryDashboard = () => {
//   // =========================
//   // State
//   // =========================

//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // =========================
//   // Get Bookings
//   // =========================

//   const getBookings = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         Swal.fire({
//           title: "Session Expired",
//           text: "Please login again.",
//           icon: "warning",
//           confirmButtonText: "OK",
//         });

//         window.location.href = "/login";
//         return;
//       }

//       console.log("TOKEN FROM STORAGE:", token);

//       const response = await fetch(
//         "http://localhost:8000/api/bookings",
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       console.log("BOOKINGS RESPONSE:", data);

//       if (!response.ok) {
//         throw new Error(
//           data.error || data.message || "Failed to get bookings"
//         );
//       }

//       setBookings(data.data?.bookings || data.bookings || []);
//     } catch (error) {
//       console.error("Get Bookings Error:", error);

//       Swal.fire({
//         title: "Error",
//         text: error.message,
//         icon: "error",
//         confirmButtonText: "OK",
//       });

//       setBookings([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // Load Bookings
//   // =========================

//   useEffect(() => {
//     getBookings();
//   }, []);

//   // =========================
//   // Approve Booking
//   // =========================

//   const handleApprove = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         throw new Error("Authentication token not found");
//       }

//       // Confirmation
//       const confirmResult = await Swal.fire({
//         title: "Approve Booking?",
//         text: "Are you sure you want to approve this booking?",
//         icon: "question",
//         showCancelButton: true,
//         confirmButtonText: "Yes, Approve",
//         cancelButtonText: "Cancel",
//         confirmButtonColor: "#16a34a",
//         cancelButtonColor: "#64748b",
//       });

//       if (!confirmResult.isConfirmed) {
//         return;
//       }

//       // Send approve request
//       const response = await fetch(
//         `http://localhost:8000/api/bookings/${bookingId}/approve`,
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       console.log("APPROVE STATUS:", response.status);
//       console.log("APPROVE RESPONSE:", data);

//       if (!response.ok) {
//         throw new Error(
//           data.error ||
//             data.message ||
//             "Failed to approve booking"
//         );
//       }

//       // Success message
//       await Swal.fire({
//         title: "Booking Approved",
//         text: `Queue Number: ${
//           data.booking?.queueNumber || "N/A"
//         }`,
//         icon: "success",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#16a34a",
//       });

//       // Refresh bookings
//       await getBookings();
//     } catch (error) {
//       console.error("Approve Booking Error:", error);

//       Swal.fire({
//         title: "Error",
//         text: error.message,
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     }
//   };

//   // =========================
//   // Reject Booking
//   // =========================

//   const handleReject = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         throw new Error("Authentication token not found");
//       }

//       // Ask for rejection reason
//       const result = await Swal.fire({
//         title: "Reject Booking",
//         input: "textarea",
//         inputLabel: "Rejection Reason",
//         inputPlaceholder:
//           "Enter the reason for rejection...",
//         inputAttributes: {
//           "aria-label": "Rejection Reason",
//         },
//         showCancelButton: true,
//         confirmButtonText: "Reject",
//         cancelButtonText: "Cancel",
//         confirmButtonColor: "#dc2626",
//         cancelButtonColor: "#64748b",

//       });


//       // User clicked Cancel
//       if (!result.isConfirmed) {
//         return;
//       }

//       const rejectionReason = result.value.trim();

//       // Send reject request
//       const response = await fetch(
//         `http://localhost:8000/api/bookings/${bookingId}/reject`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },

//           body: JSON.stringify({
//             rejectionReason,
//           }),
//         }
//       );


//       const data = await response.json();

//       console.log("REJECT STATUS:", response.status);
//       console.log("REJECT RESPONSE:", data);

//       if (!response.ok) {
//         throw new Error(
//           data.error ||
//             data.message ||
//             "Failed to reject booking"
//         );
//       }

//       // Success message
//       await Swal.fire({
//         title: "Booking Rejected",
//         text: "The booking has been rejected successfully.",
//         icon: "success",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#16a34a",
//       });

//       // Refresh bookings
//       await getBookings();
//     } catch (error) {
//       console.error("Reject Booking Error:", error);

//       Swal.fire({
//         title: "Error",
//         text: error.message,
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     }
//   };

//   // =========================
//   // Logout
//   // =========================

//   const handleLogout = () => {
//     localStorage.removeItem("token");

//     window.location.href = "/login";
//   };

//   // =========================
//   // Status
//   // =========================

//   const getStatus = (status) => {
//     switch (status) {
//       case "approved":
//         return {
//           text: "Approved",
//           className: "status-approved",
//         };

//       case "rejected":
//         return {
//           text: "Rejected",
//           className: "status-rejected",
//         };

//       case "exported":
//         return {
//           text: "Exported",
//           className: "status-exported",
//         };

//       case "pending":
//       default:
//         return {
//           text: "Pending",
//           className: "status-pending",
//         };
//     }
//   };

//   // =========================
//   // Render
//   // =========================

//   return (
//     <div
//       className="data-entry-page"
//       dir="ltr"
//     >
//       {/* ========================= */}
//       {/* Header */}
//       {/* ========================= */}

//       <header className="data-entry-header">
//         <div>
//           <h2>Data Entry Dashboard</h2>

//           <p>
//             Manage patient booking requests
//           </p>
//         </div>

//         <button
//           type="button"
//           className="logout-btn"
//           onClick={handleLogout}
//         >
//           Logout
//         </button>
//       </header>

//       {/* ========================= */}
//       {/* Main */}
//       {/* ========================= */}

//       <main className="data-entry-main">

//         {/* ========================= */}
//         {/* Dashboard Title */}
//         {/* ========================= */}

//         <div className="dashboard-title">
//           <div>
//             <h1>Booking Requests</h1>

//             <p>
//               Review and manage patient requests
//             </p>
//           </div>

//           <div className="booking-count">
//             {bookings.length} Requests
//           </div>
//         </div>

//         {/* ========================= */}
//         {/* Loading */}
//         {/* ========================= */}

//         {loading && (
//           <div className="empty-box">
//             <p>Loading bookings...</p>
//           </div>
//         )}

//         {/* ========================= */}
//         {/* No Bookings */}
//         {/* ========================= */}

//         {!loading &&
//           bookings.length === 0 && (
//             <div className="empty-box">
//               <h3>No Booking Requests</h3>

//               <p>
//                 There are currently no booking
//                 requests.
//               </p>
//             </div>
//           )}

//         {/* ========================= */}
//         {/* Booking Cards */}
//         {/* ========================= */}

//         {!loading &&
//           bookings.length > 0 && (
//             <div className="booking-grid">

//               {bookings.map((booking) => {
//                 const status = getStatus(
//                   booking.status
//                 );

//                 return (
//                   <details
//                     className="booking-card"
//                     key={booking._id}
//                   >

//                     {/* ========================= */}
//                     {/* Card Header */}
//                     {/* ========================= */}

//                     <summary className="booking-card-header">

//                       <div className="patient-info">

//                         <div className="patient-avatar">
//                           {booking.patientName
//                             ?.charAt(0)
//                             ?.toUpperCase()}
//                         </div>

//                         <div>
//                           <h3>
//                             {booking.patientName}
//                           </h3>

//                           <p>
//                             ID:{" "}
//                             {booking.nationalId}
//                           </p>
//                         </div>

//                       </div>

//                       <span
//                         className={
//                           `status-badge ` +
//                           status.className
//                         }
//                       >
//                         {status.text}
//                       </span>

//                     </summary>

//                     {/* ========================= */}
//                     {/* Card Details */}
//                     {/* ========================= */}

//                     <div className="booking-card-details">

//                       <div className="details-grid">

//                         {/* National ID */}

//                         <div className="detail-item">
//                           <span>
//                             National ID
//                           </span>

//                           <strong>
//                             {booking.nationalId}
//                           </strong>
//                         </div>

//                         {/* Phone */}

//                         <div className="detail-item">
//                           <span>
//                             Phone
//                           </span>

//                           <strong>
//                             {booking.phoneNumber ||
//                               "N/A"}
//                           </strong>
//                         </div>

//                         {/* Clinic */}

//                         <div className="detail-item">
//                           <span>
//                             Clinic
//                           </span>

//                           <strong>
//                             {booking.clinicId
//                               ?.name ||
//                               "Unknown"}
//                           </strong>
//                         </div>

//                         {/* Governorate */}

//                         <div className="detail-item">
//                           <span>
//                             Governorate
//                           </span>

//                           <strong>
//                             {booking.governorate ||
//                               "N/A"}
//                           </strong>
//                         </div>

//                         {/* Booking Date */}

//                         <div className="detail-item">
//                           <span>
//                             Booking Date
//                           </span>

//                           <strong>
//                             {booking.bookingDate
//                               ? new Date(
//                                   booking.bookingDate
//                                 ).toLocaleDateString(
//                                   "en-GB"
//                                 )
//                               : "N/A"}
//                           </strong>
//                         </div>

//                         {/* Status */}

//                         <div className="detail-item">
//                           <span>
//                             Status
//                           </span>

//                           <strong>
//                             {status.text}
//                           </strong>
//                         </div>

//                         {/* Created At */}

//                         <div className="detail-item">
//                           <span>
//                             Created At
//                           </span>

//                           <strong>
//                             {booking.createdAt
//                               ? new Date(
//                                   booking.createdAt
//                                 ).toLocaleDateString(
//                                   "en-GB"
//                                 )
//                               : "N/A"}
//                           </strong>
//                         </div>

//                       </div>

//                       {/* ========================= */}
//                       {/* Actions */}
//                       {/* ========================= */}

//                       {booking.status ===
//                         "pending" && (
//                         <div className="booking-actions">

//                           <button
//                             type="button"
//                             className="approve-btn"
//                             onClick={() =>
//                               handleApprove(
//                                 booking._id
//                               )
//                             }
//                           >
//                             ✓ Approve
//                           </button>

//                           <button
//                             type="button"
//                             className="reject-btn"
//                             onClick={() =>
//                               handleReject(
//                                 booking._id
//                               )
//                             }
//                           >
//                             ✕ Reject
//                           </button>

//                         </div>
//                       )}

//                       {/* ========================= */}
//                       {/* Approved */}
//                       {/* ========================= */}

//                       {booking.status ===
//                         "approved" && (
//                         <div className="approved-info">

//                           <strong>
//                             Queue Number
//                           </strong>

//                           <span>
//                             #
//                             {
//                               booking.queueNumber ||
//                               "N/A"
//                             }
//                           </span>

//                         </div>
//                       )}

//                       {/* ========================= */}
//                       {/* Rejected */}
//                       {/* ========================= */}

//                       {booking.status ===
//                         "rejected" && (
//                         <div className="rejected-info">

//                           <strong>
//                             Rejection Reason
//                           </strong>

//                           <span>
//                             {
//                               booking.rejectionReason ||
//                               "No reason provided"
//                             }
//                           </span>

//                         </div>
//                       )}

//                     </div>
//                   </details>
//                 );
//               })}

//             </div>
//           )}

//       </main>

//       {/* ========================= */}
//       {/* CSS */}
//       {/* ========================= */}

//       <style>{`

//         .data-entry-page {
//           min-height: 100vh;
//           background: #f5f7fb;
//           color: #1e293b;
//           font-family: Arial, sans-serif;
//         }

//         /* Header */

//         .data-entry-header {
//           background: #0c2340;
//           color: white;
//           padding: 18px 40px;

//           display: flex;
//           justify-content: space-between;
//           align-items: center;

//           box-shadow:
//             0 2px 10px
//             rgba(0, 0, 0, 0.08);
//         }

//         .data-entry-header h2 {
//           margin: 0;
//           font-size: 21px;
//         }

//         .data-entry-header p {
//           margin: 5px 0 0;
//           color: #cbd5e1;
//           font-size: 13px;
//         }

//         /* Logout */

//         .logout-btn {
//           border: none;
//           background: white;
//           color: #0c2340;

//           padding: 9px 18px;

//           border-radius: 7px;

//           cursor: pointer;

//           font-weight: bold;
//         }

//         .logout-btn:hover {
//           background: #e2e8f0;
//         }

//         /* Main */

//         .data-entry-main {
//           max-width: 1300px;
//           margin: auto;
//           padding: 35px;
//         }

//         /* Title */

//         .dashboard-title {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;

//           margin-bottom: 30px;
//         }

//         .dashboard-title h1 {
//           margin: 0;

//           font-size: 28px;

//           color: #0f172a;
//         }

//         .dashboard-title p {
//           margin-top: 7px;

//           color: #64748b;
//         }

//         /* Count */

//         .booking-count {
//           background: white;

//           border: 1px solid #e2e8f0;

//           padding: 10px 16px;

//           border-radius: 8px;

//           font-weight: bold;

//           color: #0c2340;
//         }

//         /* Cards Grid */

//         .booking-grid {
//           display: grid;

//           grid-template-columns:
//             repeat(
//               auto-fill,
//               minmax(340px, 1fr)
//             );

//           gap: 20px;

//           align-items: start;
//         }

//         /* Card */

//         .booking-card {
//           background: white;

//           border: 1px solid #e2e8f0;

//           border-radius: 12px;

//           overflow: hidden;

//           box-shadow:
//             0 3px 10px
//             rgba(15, 23, 42, 0.05);

//           transition: 0.2s;
//         }

//         .booking-card:hover {
//           transform: translateY(-2px);

//           box-shadow:
//             0 8px 20px
//             rgba(15, 23, 42, 0.09);
//         }

//         /* Card Header */

//         .booking-card-header {
//           list-style: none;

//           cursor: pointer;

//           padding: 20px;

//           display: flex;

//           justify-content:
//             space-between;

//           align-items:
//             flex-start;

//           gap: 15px;
//         }

//         .booking-card-header::-webkit-details-marker {
//           display: none;
//         }

//         /* Patient */

//         .patient-info {
//           display: flex;

//           gap: 12px;

//           align-items: center;
//         }

//         .patient-avatar {
//           width: 44px;
//           height: 44px;

//           border-radius: 50%;

//           background: #e8eef7;

//           color: #0c2340;

//           display: flex;

//           align-items: center;

//           justify-content: center;

//           font-weight: bold;

//           font-size: 18px;
//         }

//         .patient-info h3 {
//           margin: 0 0 5px;

//           font-size: 16px;

//           color: #0f172a;
//         }

//         .patient-info p {
//           margin: 0;

//           color: #64748b;

//           font-size: 12px;
//         }

//         /* Status */

//         .status-badge {
//           padding: 5px 9px;

//           border-radius: 20px;

//           font-size: 11px;

//           font-weight: bold;

//           white-space: nowrap;
//         }

//         .status-pending {
//           background: #fef3c7;

//           color: #b45309;
//         }

//         .status-approved {
//           background: #dcfce7;

//           color: #15803d;
//         }

//         .status-rejected {
//           background: #fee2e2;

//           color: #b91c1c;
//         }

//         .status-exported {
//           background: #e0e7ff;

//           color: #4338ca;
//         }

//         /* Details */

//         .booking-card-details {
//           border-top:
//             1px solid #e2e8f0;

//           padding: 20px;
//         }

//         .details-grid {
//           display: grid;

//           grid-template-columns:
//             1fr 1fr;

//           gap: 16px;
//         }

//         .detail-item {
//           display: flex;

//           flex-direction: column;

//           gap: 5px;
//         }

//         .detail-item span {
//           color: #94a3b8;

//           font-size: 11px;
//         }

//         .detail-item strong {
//           color: #334155;

//           font-size: 13px;
//         }

//         /* Actions */

//         .booking-actions {
//           display: flex;

//           gap: 10px;

//           margin-top: 22px;

//           padding-top: 18px;

//           border-top:
//             1px solid #e2e8f0;
//         }

//         .approve-btn,
//         .reject-btn {
//           width: 100%;

//           border: none;

//           padding: 11px;

//           border-radius: 7px;

//           cursor: pointer;

//           font-weight: bold;

//           font-size: 13px;

//           color: white;

//           transition: 0.2s;
//         }

//         .approve-btn {
//           background: #16a34a;
//         }

//         .approve-btn:hover {
//           background: #15803d;
//         }

//         .reject-btn {
//           background: #dc2626;
//         }

//         .reject-btn:hover {
//           background: #b91c1c;
//         }

//         /* Approved */

//         .approved-info {
//           margin-top: 20px;

//           padding: 14px;

//           border-radius: 8px;

//           display: flex;

//           justify-content:
//             space-between;

//           align-items: center;

//           background: #f0fdf4;

//           color: #166534;
//         }

//         .approved-info span {
//           font-size: 22px;

//           font-weight: bold;
//         }

//         /* Rejected */

//         .rejected-info {
//           margin-top: 20px;

//           padding: 14px;

//           border-radius: 8px;

//           background: #fef2f2;

//           color: #991b1b;

//           display: flex;

//           flex-direction: column;

//           align-items: flex-start;

//           gap: 5px;
//         }

//         /* Empty */

//         .empty-box {
//           background: white;

//           border:
//             1px solid #e2e8f0;

//           border-radius: 12px;

//           padding: 60px 20px;

//           text-align: center;

//           color: #64748b;
//         }

//         /* Mobile */

//         @media (max-width: 700px) {

//           .data-entry-header {
//             padding: 15px 20px;
//           }

//           .data-entry-main {
//             padding: 20px;
//           }

//           .dashboard-title {
//             align-items: flex-start;

//             flex-direction: column;

//             gap: 15px;
//           }

//           .booking-grid {
//             grid-template-columns: 1fr;
//           }

//           .details-grid {
//             grid-template-columns: 1fr;
//           }

//         }

//       `}</style>

//     </div>
//   );
// };

// export default DataEntryDashboard;




// import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";

// const DataEntryDashboard = () => {
//   // =========================
//   // State
//   // =========================

//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Search input
//   const [search, setSearch] = useState("");

//   // Filter by booking status
//   const [statusFilter, setStatusFilter] = useState("all");

//   // Store the booking ID currently being processed
//   const [processingId, setProcessingId] = useState(null);

//   // =========================
//   // Get Bookings
//   // =========================

//   const getBookings = async () => {
//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");

//       // Check if user has a login token
//       if (!token) {
//         Swal.fire({
//           title: "Session Expired",
//           text: "Please login again.",
//           icon: "warning",
//           confirmButtonText: "OK",
//         });

//         window.location.href = "/login";
//         return;
//       }

//       const response = await fetch(
//         "http://localhost:8000/api/bookings",
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       console.log("BOOKINGS RESPONSE:", data);

//       if (!response.ok) {
//         throw new Error(
//           data.error ||
//             data.message ||
//             "Failed to get bookings"
//         );
//       }

//       // Backend returns bookings inside data.bookings
//       setBookings(data.data?.bookings || []);
//     } catch (error) {
//       console.error("Get Bookings Error:", error);

//       Swal.fire({
//         title: "Error",
//         text: error.message,
//         icon: "error",
//         confirmButtonText: "OK",
//       });

//       setBookings([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // Load Bookings
//   // =========================

//   useEffect(() => {
//     getBookings();
//   }, []);

//   // =========================
//   // Approve Booking
//   // =========================

//   const handleApprove = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         throw new Error("Authentication token not found");
//       }

//       // Ask the user to confirm the approval
//       const confirmResult = await Swal.fire({
//         title: "Approve Booking?",
//         text: "Are you sure you want to approve this booking?",
//         icon: "question",
//         showCancelButton: true,
//         confirmButtonText: "Yes, Approve",
//         cancelButtonText: "Cancel",
//         confirmButtonColor: "#16a34a",
//         cancelButtonColor: "#64748b",
//       });

//       if (!confirmResult.isConfirmed) {
//         return;
//       }

//       // Show loading state on the selected booking
//       setProcessingId(bookingId);

//       const response = await fetch(
//         `http://localhost:8000/api/bookings/${bookingId}/approve`,
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       console.log("APPROVE RESPONSE:", data);

//       if (!response.ok) {
//         throw new Error(
//           data.error ||
//             data.message ||
//             "Failed to approve booking"
//         );
//       }

//       await Swal.fire({
//         title: "Booking Approved",
//         text: `Queue Number: ${
//           data.booking?.queueNumber || "N/A"
//         }`,
//         icon: "success",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#16a34a",
//       });

//       // Reload the bookings after approval
//       await getBookings();
//     } catch (error) {
//       console.error("Approve Booking Error:", error);

//       Swal.fire({
//         title: "Error",
//         text: error.message,
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   // =========================
//   // Reject Booking
//   // =========================

//   const handleReject = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         throw new Error("Authentication token not found");
//       }

//       // Ask for an optional rejection reason
//       const result = await Swal.fire({
//         title: "Reject Booking",
//         input: "textarea",
//         inputLabel: "Rejection Reason (Optional)",
//         inputPlaceholder:
//           "Enter a reason if needed...",
//         inputAttributes: {
//           "aria-label": "Rejection Reason",
//         },
//         showCancelButton: true,
//         confirmButtonText: "Reject",
//         cancelButtonText: "Cancel",
//         confirmButtonColor: "#dc2626",
//         cancelButtonColor: "#64748b",
//       });

//       // User cancelled the operation
//       if (!result.isConfirmed) {
//         return;
//       }

//       // Rejection reason is optional
//       const rejectionReason =
//         result.value?.trim() || "";

//       // Show loading state on the selected booking
//       setProcessingId(bookingId);

//       const response = await fetch(
//         `http://localhost:8000/api/bookings/${bookingId}/reject`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             rejectionReason,
//           }),
//         }
//       );

//       const data = await response.json();

//       console.log("REJECT RESPONSE:", data);

//       if (!response.ok) {
//         throw new Error(
//           data.error ||
//             data.message ||
//             "Failed to reject booking"
//         );
//       }

//       await Swal.fire({
//         title: "Booking Rejected",
//         text: "The booking has been rejected successfully.",
//         icon: "success",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#16a34a",
//       });

//       // Reload the bookings after rejection
//       await getBookings();
//     } catch (error) {
//       console.error("Reject Booking Error:", error);

//       Swal.fire({
//         title: "Error",
//         text: error.message,
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   // =========================
//   // Logout
//   // =========================

//   const handleLogout = () => {
//     localStorage.removeItem("token");

//     window.location.href = "/login";
//   };

//   // =========================
//   // Get Status Information
//   // =========================

//   const getStatus = (status) => {
//     switch (status) {
//       case "approved":
//         return {
//           text: "Approved",
//           className: "status-approved",
//         };

//       case "rejected":
//         return {
//           text: "Rejected",
//           className: "status-rejected",
//         };

//       case "exported":
//         return {
//           text: "Exported",
//           className: "status-exported",
//         };

//       case "pending":
//       default:
//         return {
//           text: "Pending",
//           className: "status-pending",
//         };
//     }
//   };

//   // =========================
//   // Statistics
//   // =========================
//   // Calculate the number of bookings for each status

//   const totalBookings = bookings.length;

//   const pendingBookings = bookings.filter(
//     (booking) => booking.status === "pending"
//   ).length;

//   const approvedBookings = bookings.filter(
//     (booking) => booking.status === "approved"
//   ).length;

//   const rejectedBookings = bookings.filter(
//     (booking) => booking.status === "rejected"
//   ).length;

//   // =========================
//   // Search + Status Filter
//   // =========================
//   // Filter bookings before displaying them

//   const filteredBookings = bookings.filter(
//     (booking) => {
//       const searchValue =
//         search.toLowerCase().trim();

//       const matchesSearch =
//         booking.patientName
//           ?.toLowerCase()
//           .includes(searchValue) ||
//         booking.nationalId
//           ?.toLowerCase()
//           .includes(searchValue) ||
//         booking.phoneNumber
//           ?.toLowerCase()
//           .includes(searchValue);

//       const matchesStatus =
//         statusFilter === "all" ||
//         booking.status === statusFilter;

//       return matchesSearch && matchesStatus;
//     }
//   );

//   // =========================
//   // Render
//   // =========================

//   return (
//     <div
//       className="data-entry-page"
//       dir="ltr"
//     >
//       {/* =========================
//           Header
//       ========================= */}

//       <header className="data-entry-header">
//         <div>
//           <h2>Data Entry Dashboard</h2>

//           <p>
//             Manage patient booking requests
//           </p>
//         </div>

//         <button
//           type="button"
//           className="logout-btn"
//           onClick={handleLogout}
//         >
//           Logout
//         </button>
//       </header>

//       {/* =========================
//           Main
//       ========================= */}

//       <main className="data-entry-main">

//         {/* =========================
//             Dashboard Title
//         ========================= */}

//         <div className="dashboard-title">
//           <div>
//             <h1>Booking Requests</h1>

//             <p>
//               Review and manage patient requests
//             </p>
//           </div>

//           {/* Refresh button */}
//           <button
//             type="button"
//             className="refresh-btn"
//             onClick={getBookings}
//             disabled={loading}
//           >
//             {loading
//               ? "Refreshing..."
//               : "↻ Refresh"}
//           </button>
//         </div>

//         {/* =========================
//             Statistics Cards
//         ========================= */}

//         <div className="statistics-grid">

//           <div className="stat-card">
//             <span>Total Requests</span>
//             <strong>{totalBookings}</strong>
//           </div>

//           <div className="stat-card pending-stat">
//             <span>Pending</span>
//             <strong>{pendingBookings}</strong>
//           </div>

//           <div className="stat-card approved-stat">
//             <span>Approved</span>
//             <strong>{approvedBookings}</strong>
//           </div>

//           <div className="stat-card rejected-stat">
//             <span>Rejected</span>
//             <strong>{rejectedBookings}</strong>
//           </div>

//         </div>

//         {/* =========================
//             Search + Filter
//         ========================= */}

//         <div className="filters-area">

//           {/* Search input */}
//           <input
//             type="text"
//             className="search-input"
//             placeholder="Search by name, national ID or phone..."
//             value={search}
//             onChange={(e) =>
//               setSearch(e.target.value)
//             }
//           />

//           {/* Status filter */}
//           <select
//             className="status-filter"
//             value={statusFilter}
//             onChange={(e) =>
//               setStatusFilter(e.target.value)
//             }
//           >
//             <option value="all">
//               All Statuses
//             </option>

//             <option value="pending">
//               Pending
//             </option>

//             <option value="approved">
//               Approved
//             </option>

//             <option value="rejected">
//               Rejected
//             </option>
//           </select>

//         </div>

//         {/* =========================
//             Loading
//         ========================= */}

//         {loading && (
//           <div className="empty-box">
//             <p>Loading bookings...</p>
//           </div>
//         )}

//         {/* =========================
//             No Results
//         ========================= */}

//         {!loading &&
//           filteredBookings.length === 0 && (
//             <div className="empty-box">

//               <h3>
//                 No Booking Requests
//               </h3>

//               <p>
//                 No bookings match your search
//                 or filter.
//               </p>

//             </div>
//           )}

//         {/* =========================
//             Booking Cards
//         ========================= */}

//         {!loading &&
//           filteredBookings.length > 0 && (

//             <div className="booking-grid">

//               {filteredBookings.map(
//                 (booking) => {

//                   const status =
//                     getStatus(
//                       booking.status
//                     );

//                   const isProcessing =
//                     processingId ===
//                     booking._id;

//                   return (
//                     <details
//                       className="booking-card"
//                       key={booking._id}
//                     >

//                       {/* =========================
//                           Card Header
//                       ========================= */}

//                       <summary className="booking-card-header">

//                         <div className="patient-info">

//                           <div className="patient-avatar">
//                             {booking.patientName
//                               ?.charAt(0)
//                               ?.toUpperCase()}
//                           </div>

//                           <div>

//                             <h3>
//                               {
//                                 booking.patientName
//                               }
//                             </h3>

//                             <p>
//                               ID:{" "}
//                               {
//                                 booking.nationalId
//                               }
//                             </p>

//                           </div>

//                         </div>

//                         <div className="card-header-right">

//                           {/* Status badge */}
//                           <span
//                             className={
//                               `status-badge ` +
//                               status.className
//                             }
//                           >
//                             {status.text}
//                           </span>

//                           {/* Queue number */}
//                           {booking.status ===
//                             "approved" && (
//                             <span className="queue-badge">
//                               Queue #
//                               {
//                                 booking.queueNumber ||
//                                 "N/A"
//                               }
//                             </span>
//                           )}

//                         </div>

//                       </summary>

//                       {/* =========================
//                           Card Details
//                       ========================= */}

//                       <div className="booking-card-details">

//                         <div className="details-grid">

//                           {/* National ID */}
//                           <div className="detail-item">
//                             <span>
//                               National ID
//                             </span>

//                             <strong>
//                               {
//                                 booking.nationalId
//                               }
//                             </strong>
//                           </div>

//                           {/* Phone */}
//                           <div className="detail-item">
//                             <span>
//                               Phone
//                             </span>

//                             <strong>
//                               {booking.phoneNumber ||
//                                 "N/A"}
//                             </strong>
//                           </div>

//                           {/* Clinic */}
//                           <div className="detail-item">
//                             <span>
//                               Clinic
//                             </span>

//                             <strong>
//                               {booking.clinicId
//                                 ?.name ||
//                                 "Unknown"}
//                             </strong>
//                           </div>

//                           {/* Governorate */}
//                           <div className="detail-item">
//                             <span>
//                               Governorate
//                             </span>

//                             <strong>
//                               {
//                                 booking.governorate
//                               }
//                             </strong>
//                           </div>

//                           {/* Booking Date */}
//                           <div className="detail-item">
//                             <span>
//                               Booking Date
//                             </span>

//                             <strong>
//                               {booking.bookingDate
//                                 ? new Date(
//                                     booking.bookingDate
//                                   ).toLocaleDateString(
//                                     "en-GB"
//                                   )
//                                 : "N/A"}
//                             </strong>
//                           </div>

//                           {/* Created At */}
//                           <div className="detail-item">
//                             <span>
//                               Created At
//                             </span>

//                             <strong>
//                               {booking.createdAt
//                                 ? new Date(
//                                     booking.createdAt
//                                   ).toLocaleString(
//                                     "en-GB"
//                                   )
//                                 : "N/A"}
//                             </strong>
//                           </div>

//                         </div>

//                         {/* =========================
//                             Pending Actions
//                         ========================= */}

//                         {booking.status ===
//                           "pending" && (

//                           <div className="booking-actions">

//                             <button
//                               type="button"
//                               className="approve-btn"
//                               disabled={
//                                 isProcessing
//                               }
//                               onClick={() =>
//                                 handleApprove(
//                                   booking._id
//                                 )
//                               }
//                             >
//                               {isProcessing
//                                 ? "Processing..."
//                                 : "✓ Approve"}
//                             </button>

//                             <button
//                               type="button"
//                               className="reject-btn"
//                               disabled={
//                                 isProcessing
//                               }
//                               onClick={() =>
//                                 handleReject(
//                                   booking._id
//                                 )
//                               }
//                             >
//                               {isProcessing
//                                 ? "Processing..."
//                                 : "✕ Reject"}
//                             </button>

//                           </div>
//                         )}

//                         {/* =========================
//                             Approved Information
//                         ========================= */}

//                         {booking.status ===
//                           "approved" && (

//                           <div className="approved-info">

//                             <strong>
//                               Queue Number
//                             </strong>

//                             <span>
//                               #
//                               {
//                                 booking.queueNumber ||
//                                 "N/A"
//                               }
//                             </span>

//                           </div>
//                         )}

//                         {/* =========================
//                             Rejected Information
//                         ========================= */}

//                         {booking.status ===
//                           "rejected" && (

//                           <div className="rejected-info">

//                             <strong>
//                               Rejection Reason
//                             </strong>

//                             <span>
//                               {
//                                 booking.rejectionReason ||
//                                 "No reason provided"
//                               }
//                             </span>

//                           </div>
//                         )}

//                       </div>

//                     </details>
//                   );
//                 }
//               )}

//             </div>
//           )}

//       </main>

//       {/* =========================
//           CSS
//       ========================= */}

//       <style>{`

//         .data-entry-page {
//           min-height: 100vh;
//           background: #f5f7fb;
//           color: #1e293b;
//           font-family: Arial, sans-serif;
//         }

//         /* Header */

//         .data-entry-header {
//           background: #0c2340;
//           color: white;
//           padding: 18px 40px;

//           display: flex;
//           justify-content: space-between;
//           align-items: center;

//           box-shadow:
//             0 2px 10px
//             rgba(0, 0, 0, 0.08);
//         }

//         .data-entry-header h2 {
//           margin: 0;
//           font-size: 21px;
//         }

//         .data-entry-header p {
//           margin: 5px 0 0;
//           color: #cbd5e1;
//           font-size: 13px;
//         }

//         /* Logout */

//         .logout-btn {
//           border: none;
//           background: white;
//           color: #0c2340;

//           padding: 9px 18px;

//           border-radius: 7px;

//           cursor: pointer;

//           font-weight: bold;
//         }

//         .logout-btn:hover {
//           background: #e2e8f0;
//         }

//         /* Main */

//         .data-entry-main {
//           max-width: 1300px;
//           margin: auto;
//           padding: 35px;
//         }

//         /* Dashboard title */

//         .dashboard-title {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;

//           margin-bottom: 25px;
//         }

//         .dashboard-title h1 {
//           margin: 0;

//           font-size: 28px;

//           color: #0f172a;
//         }

//         .dashboard-title p {
//           margin-top: 7px;

//           color: #64748b;
//         }

//         /* Refresh */

//         .refresh-btn {
//           border: none;

//           background: #0c2340;

//           color: white;

//           padding: 11px 18px;

//           border-radius: 7px;

//           cursor: pointer;

//           font-weight: bold;
//         }

//         .refresh-btn:hover {
//           background: #17375e;
//         }

//         .refresh-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         /* Statistics */

//         .statistics-grid {
//           display: grid;

//           grid-template-columns:
//             repeat(4, 1fr);

//           gap: 15px;

//           margin-bottom: 25px;
//         }

//         .stat-card {
//           background: white;

//           border:
//             1px solid #e2e8f0;

//           border-radius: 10px;

//           padding: 18px;

//           display: flex;

//           flex-direction: column;

//           gap: 8px;
//         }

//         .stat-card span {
//           color: #64748b;

//           font-size: 13px;
//         }

//         .stat-card strong {
//           color: #0c2340;

//           font-size: 25px;
//         }

//         .pending-stat {
//           border-left:
//             4px solid #f59e0b;
//         }

//         .approved-stat {
//           border-left:
//             4px solid #16a34a;
//         }

//         .rejected-stat {
//           border-left:
//             4px solid #dc2626;
//         }

//         /* Search and Filter */

//         .filters-area {
//           display: flex;

//           gap: 12px;

//           margin-bottom: 25px;
//         }

//         .search-input {
//           flex: 1;

//           border:
//             1px solid #cbd5e1;

//           border-radius: 8px;

//           padding: 12px 15px;

//           font-size: 14px;

//           outline: none;
//         }

//         .search-input:focus {
//           border-color: #0c2340;
//         }

//         .status-filter {
//           width: 180px;

//           border:
//             1px solid #cbd5e1;

//           border-radius: 8px;

//           padding: 12px;

//           background: white;

//           cursor: pointer;

//           outline: none;
//         }

//         /* Cards Grid */

//         .booking-grid {
//           display: grid;

//           grid-template-columns:
//             repeat(
//               auto-fill,
//               minmax(340px, 1fr)
//             );

//           gap: 20px;

//           align-items: start;
//         }

//         /* Card */

//         .booking-card {
//           background: white;

//           border:
//             1px solid #e2e8f0;

//           border-radius: 12px;

//           overflow: hidden;

//           box-shadow:
//             0 3px 10px
//             rgba(15, 23, 42, 0.05);

//           transition: 0.2s;
//         }

//         .booking-card:hover {
//           transform: translateY(-2px);

//           box-shadow:
//             0 8px 20px
//             rgba(15, 23, 42, 0.09);
//         }

//         /* Card Header */

//         .booking-card-header {
//           list-style: none;

//           cursor: pointer;

//           padding: 20px;

//           display: flex;

//           justify-content:
//             space-between;

//           align-items:
//             flex-start;

//           gap: 15px;
//         }

//         .booking-card-header::-webkit-details-marker {
//           display: none;
//         }

//         /* Patient */

//         .patient-info {
//           display: flex;

//           gap: 12px;

//           align-items: center;
//         }

//         .patient-avatar {
//           width: 44px;
//           height: 44px;

//           border-radius: 50%;

//           background: #e8eef7;

//           color: #0c2340;

//           display: flex;

//           align-items: center;

//           justify-content: center;

//           font-weight: bold;

//           font-size: 18px;
//         }

//         .patient-info h3 {
//           margin: 0 0 5px;

//           font-size: 16px;

//           color: #0f172a;
//         }

//         .patient-info p {
//           margin: 0;

//           color: #64748b;

//           font-size: 12px;
//         }

//         /* Card Header Right Side */

//         .card-header-right {
//           display: flex;

//           flex-direction: column;

//           align-items: flex-end;

//           gap: 8px;
//         }

//         /* Status */

//         .status-badge {
//           padding: 5px 9px;

//           border-radius: 20px;

//           font-size: 11px;

//           font-weight: bold;

//           white-space: nowrap;
//         }

//         .status-pending {
//           background: #fef3c7;

//           color: #b45309;
//         }

//         .status-approved {
//           background: #dcfce7;

//           color: #15803d;
//         }

//         .status-rejected {
//           background: #fee2e2;

//           color: #b91c1c;
//         }

//         .status-exported {
//           background: #e0e7ff;

//           color: #4338ca;
//         }

//         /* Queue badge */

//         .queue-badge {
//           background: #0c2340;

//           color: white;

//           padding: 5px 9px;

//           border-radius: 6px;

//           font-size: 12px;

//           font-weight: bold;

//           white-space: nowrap;
//         }

//         /* Details */

//         .booking-card-details {
//           border-top:
//             1px solid #e2e8f0;

//           padding: 20px;
//         }

//         .details-grid {
//           display: grid;

//           grid-template-columns:
//             1fr 1fr;

//           gap: 16px;
//         }

//         .detail-item {
//           display: flex;

//           flex-direction: column;

//           gap: 5px;
//         }

//         .detail-item span {
//           color: #94a3b8;

//           font-size: 11px;
//         }

//         .detail-item strong {
//           color: #334155;

//           font-size: 13px;
//         }

//         /* Actions */

//         .booking-actions {
//           display: flex;

//           gap: 10px;

//           margin-top: 22px;

//           padding-top: 18px;

//           border-top:
//             1px solid #e2e8f0;
//         }

//         .approve-btn,
//         .reject-btn {
//           width: 50%;

//           border: none;

//           padding: 11px;

//           border-radius: 7px;

//           cursor: pointer;

//           font-weight: bold;

//           font-size: 13px;

//           color: white;

//           transition: 0.2s;
//         }

//         .approve-btn {
//           background: #16a34a;
//         }

//         .approve-btn:hover {
//           background: #15803d;
//         }

//         .reject-btn {
//           background: #dc2626;
//         }

//         .reject-btn:hover {
//           background: #b91c1c;
//         }

//         .approve-btn:disabled,
//         .reject-btn:disabled {
//           opacity: 0.6;

//           cursor: not-allowed;
//         }

//         /* Approved */

//         .approved-info {
//           margin-top: 20px;

//           padding: 14px;

//           border-radius: 8px;

//           display: flex;

//           justify-content:
//             space-between;

//           align-items: center;

//           background: #f0fdf4;

//           color: #166534;
//         }

//         .approved-info span {
//           font-size: 22px;

//           font-weight: bold;
//         }

//         /* Rejected */

//         .rejected-info {
//           margin-top: 20px;

//           padding: 14px;

//           border-radius: 8px;

//           background: #fef2f2;

//           color: #991b1b;

//           display: flex;

//           flex-direction: column;

//           align-items: flex-start;

//           gap: 5px;
//         }

//         /* Empty */

//         .empty-box {
//           background: white;

//           border:
//             1px solid #e2e8f0;

//           border-radius: 12px;

//           padding: 60px 20px;

//           text-align: center;

//           color: #64748b;
//         }

//         /* Mobile */

//         @media (max-width: 900px) {

//           .statistics-grid {
//             grid-template-columns:
//               repeat(2, 1fr);
//           }

//         }

//         @media (max-width: 700px) {

//           .data-entry-header {
//             padding: 15px 20px;
//           }

//           .data-entry-main {
//             padding: 20px;
//           }

//           .dashboard-title {
//             align-items:
//               flex-start;

//             flex-direction:
//               column;

//             gap: 15px;
//           }

//           .statistics-grid {
//             grid-template-columns: 1fr;
//           }

//           .filters-area {
//             flex-direction: column;
//           }

//           .status-filter {
//             width: 100%;
//           }

//           .booking-grid {
//             grid-template-columns: 1fr;
//           }

//           .details-grid {
//             grid-template-columns: 1fr;
//           }

//           .booking-card-header {
//             flex-direction: column;
//           }

//           .card-header-right {
//             align-items: flex-start;
//           }
//         }

//       `}</style>
//     </div>
//   );
// };

// export default DataEntryDashboard;


import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const DataEntryDashboard = () => {
  // =========================
  // State
  // =========================

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Store selected booking IDs for bulk actions
  const [selectedBookings, setSelectedBookings] = useState([]);

  // =========================
  // Get Bookings
  // =========================

  const getBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/bookings",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to get bookings"
        );
      }

      setBookings(data.data?.bookings || []);

    } catch (error) {
      console.error("Get Bookings Error:", error);

      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Load Bookings
  // =========================

  useEffect(() => {
    getBookings();
  }, []);

  // =========================
  // Select / Unselect Booking
  // =========================

  const handleSelectBooking = (bookingId) => {
    setSelectedBookings((prev) => {
      if (prev.includes(bookingId)) {
        return prev.filter((id) => id !== bookingId);
      }

      return [...prev, bookingId];
    });
  };

  // =========================
  // Select All Pending Bookings
  // =========================

  const handleSelectAll = () => {
    const pendingBookings = bookings
      .filter((booking) => booking.status === "pending")
      .map((booking) => booking._id);

    setSelectedBookings(pendingBookings);
  };

  // =========================
  // Clear Selection
  // =========================

  const handleClearSelection = () => {
    setSelectedBookings([]);
  };

  // =========================
  // Approve Single Booking
  // =========================

  const handleApprove = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");

      const confirmResult = await Swal.fire({
        title: "Approve Booking?",
        text: "Are you sure you want to approve this booking?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Approve",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#16a34a",
      });

      if (!confirmResult.isConfirmed) {
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/bookings/${bookingId}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to approve booking"
        );
      }

      await Swal.fire({
        title: "Booking Approved",
        text: `Queue Number: ${
          data.booking?.queueNumber || "N/A"
        }`,
        icon: "success",
        confirmButtonText: "OK",
      });

      getBookings();

    } catch (error) {
      console.error("Approve Booking Error:", error);

      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  // =========================
  // Reject Single Booking
  // =========================

  const handleReject = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");

      const result = await Swal.fire({
        title: "Reject Booking",
        input: "textarea",
        inputLabel: "Rejection Reason (Optional)",
        inputPlaceholder: "Enter rejection reason...",
        showCancelButton: true,
        confirmButtonText: "Reject",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#dc2626",
      });

      if (!result.isConfirmed) {
        return;
      }

      // Rejection reason is optional
      const rejectionReason =
        result.value?.trim() || "";

      const response = await fetch(
        `http://localhost:8000/api/bookings/${bookingId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rejectionReason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to reject booking"
        );
      }

      await Swal.fire({
        title: "Booking Rejected",
        text: "The booking has been rejected successfully.",
        icon: "success",
      });

      getBookings();

    } catch (error) {
      console.error("Reject Booking Error:", error);

      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  // =========================
  // Bulk Approve
  // =========================

//   const handleBulkApprove = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     const confirmResult = await Swal.fire({
//       title: "Approve All Pending Bookings?",
//       text: "All pending bookings will be approved and assigned queue numbers.",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "Yes, Approve All",
//       cancelButtonText: "Cancel",
//       confirmButtonColor: "#16a34a",
//     });

//     if (!confirmResult.isConfirmed) {
//       return;
//     }

//     const response = await fetch(
//       "http://localhost:8000/api/bookings/approve-all",
//       {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         data.error || "Failed to approve all bookings"
//       );
//     }

//     await Swal.fire({
//       title: "Success",
//       text: `${data.approvedCount || "All"} bookings have been approved successfully.`,
//       icon: "success",
//     });

//     setSelectedBookings([]);

//     await getBookings();

//   } catch (error) {
//     console.error("Approve All Error:", error);

//     Swal.fire({
//       title: "Error",
//       text: error.message,
//       icon: "error",
//     });
//   }
// };

const handleBulkApprove = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Approve All Pending Bookings?",
      text: "All pending bookings will be approved and assigned queue numbers.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve All",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    const response = await fetch(
      "http://localhost:8000/api/bookings/approve-all",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to approve all bookings"
      );
    }

    await Swal.fire({
      title: "Success",
      text: `${data.approvedCount} bookings have been approved successfully.`,
      icon: "success",
      confirmButtonText: "OK",
    });

    setSelectedBookings([]);

    await getBookings();

  } catch (error) {
    console.error("Approve All Error:", error);

    Swal.fire({
      title: "Error",
      text: error.message || "Something went wrong",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};


  // =========================
  // Bulk Reject
  // =========================

  const handleBulkReject = async () => {
    if (selectedBookings.length === 0) {
      Swal.fire({
        title: "No Bookings Selected",
        text: "Please select at least one booking.",
        icon: "warning",
      });

      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Ask for optional rejection reason
      const result = await Swal.fire({
        title: "Reject Selected Bookings",
        input: "textarea",
        inputLabel: "Rejection Reason (Optional)",
        inputPlaceholder: "Enter rejection reason...",
        showCancelButton: true,
        confirmButtonText: "Reject All",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#dc2626",
      });

      if (!result.isConfirmed) {
        return;
      }

      const rejectionReason =
        result.value?.trim() || "";

      const response = await fetch(
        "http://localhost:8000/api/bookings/reject-all",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingIds: selectedBookings,
            rejectionReason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to reject bookings"
        );
      }

      await Swal.fire({
        title: "Success",
        text: "Selected bookings have been rejected.",
        icon: "success",
      });

      // Clear selection
      setSelectedBookings([]);

      // Reload bookings
      getBookings();

    } catch (error) {
      console.error(
        "Bulk Reject Error:",
        error
      );

      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // =========================
  // Status
  // =========================

  const getStatus = (status) => {
    switch (status) {
      case "approved":
        return {
          text: "Approved",
          className: "status-approved",
        };

      case "rejected":
        return {
          text: "Rejected",
          className: "status-rejected",
        };

      case "exported":
        return {
          text: "Exported",
          className: "status-exported",
        };

      default:
        return {
          text: "Pending",
          className: "status-pending",
        };
    }
  };

  // =========================
  // Render
  // =========================

  return (
    <div
      className="data-entry-page"
      dir="ltr"
    >

      {/* =========================
          Header
      ========================= */}

      <header className="data-entry-header">

        <div>
          <h2>Data Entry Dashboard</h2>

          <p>
            Manage patient booking requests
          </p>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>

      {/* =========================
          Main
      ========================= */}

      <main className="data-entry-main">

        {/* Dashboard Title */}

        <div className="dashboard-title">

          <div>
            <h1>Booking Requests</h1>

            <p>
              Review and manage patient requests
            </p>
          </div>

          <div className="booking-count">
            {bookings.length} Requests
          </div>

        </div>

        {/* =========================
            Bulk Actions
        ========================= */}

        {!loading &&
          bookings.length > 0 && (

            <div className="bulk-actions">

              <button
                className="select-all-btn"
                onClick={handleSelectAll}
              >
                Select All Pending
              </button>

              <button
                className="clear-btn"
                onClick={handleClearSelection}
              >
                Clear Selection
              </button>

              <button
                className="bulk-approve-btn"
                onClick={handleBulkApprove}
                disabled={
                  selectedBookings.length === 0
                }
              >
                ✓ Approve Selected
                {selectedBookings.length > 0 &&
                  ` (${selectedBookings.length})`}
              </button>

              <button
                className="bulk-reject-btn"
                onClick={handleBulkReject}
                disabled={
                  selectedBookings.length === 0
                }
              >
                ✕ Reject Selected
                {selectedBookings.length > 0 &&
                  ` (${selectedBookings.length})`}
              </button>

            </div>
          )}

        {/* Loading */}

        {loading && (
          <div className="empty-box">
            <p>Loading bookings...</p>
          </div>
        )}

        {/* Empty */}

        {!loading &&
          bookings.length === 0 && (

            <div className="empty-box">

              <h3>
                No Booking Requests
              </h3>

              <p>
                There are currently no booking
                requests.
              </p>

            </div>
          )}

        {/* =========================
            Booking Cards
        ========================= */}

        {!loading &&
          bookings.length > 0 && (

            <div className="booking-grid">

              {bookings.map((booking) => {

                const status =
                  getStatus(booking.status);

                const isSelected =
                  selectedBookings.includes(
                    booking._id
                  );

                return (

                  <details
                    className={`booking-card ${
                      isSelected
                        ? "selected-card"
                        : ""
                    }`}
                    key={booking._id}
                  >

                    <summary
                      className="booking-card-header"
                    >

                      <div className="patient-info">

                        {/* Checkbox */}

                        {booking.status ===
                          "pending" && (

                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();

                              handleSelectBooking(
                                booking._id
                              );
                            }}
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                          />
                        )}

                        <div className="patient-avatar">

                          {booking.patientName
                            ?.charAt(0)
                            ?.toUpperCase()}

                        </div>

                        <div>

                          <h3>
                            {booking.patientName}
                          </h3>

                          <p>
                            ID:{" "}
                            {booking.nationalId}
                          </p>

                        </div>

                      </div>

                      <div className="card-header-right">

                        {/* Queue Number */}

                        {booking.status ===
                          "approved" && (

                          <span className="queue-number">
                            #{booking.queueNumber}
                          </span>
                        )}

                        <span
                          className={`status-badge ${status.className}`}
                        >
                          {status.text}
                        </span>

                      </div>

                    </summary>

                    {/* =========================
                        Card Details
                    ========================= */}

                    <div className="booking-card-details">

                      <div className="details-grid">

                        <div className="detail-item">
                          <span>
                            National ID
                          </span>

                          <strong>
                            {booking.nationalId}
                          </strong>
                        </div>

                        <div className="detail-item">
                          <span>
                            Phone
                          </span>

                          <strong>
                            {booking.phoneNumber ||
                              "N/A"}
                          </strong>
                        </div>

                        <div className="detail-item">
                          <span>
                            Clinic
                          </span>

                          <strong>
                            {booking.clinicId?.name ||
                              "Unknown"}
                          </strong>
                        </div>

                        <div className="detail-item">
                          <span>
                            Governorate
                          </span>

                          <strong>
                            {booking.governorate ||
                              "N/A"}
                          </strong>
                        </div>

                        <div className="detail-item">
                          <span>
                            Booking Date
                          </span>

                          <strong>
                            {booking.bookingDate
                              ? new Date(
                                  booking.bookingDate
                                ).toLocaleDateString(
                                  "en-GB"
                                )
                              : "N/A"}
                          </strong>
                        </div>

                        <div className="detail-item">
                          <span>
                            Created At
                          </span>

                          <strong>
                            {booking.createdAt
                              ? new Date(
                                  booking.createdAt
                                ).toLocaleDateString(
                                  "en-GB"
                                )
                              : "N/A"}
                          </strong>
                        </div>

                      </div>

                      {/* Individual Actions */}

                      {booking.status ===
                        "pending" && (

                        <div className="booking-actions">

                          <button
                            className="approve-btn"
                            onClick={() =>
                              handleApprove(
                                booking._id
                              )
                            }
                          >
                            ✓ Approve
                          </button>

                          <button
                            className="reject-btn"
                            onClick={() =>
                              handleReject(
                                booking._id
                              )
                            }
                          >
                            ✕ Reject
                          </button>

                        </div>
                      )}

                      {/* Approved */}

                      {booking.status ===
                        "approved" && (

                        <div className="approved-info">

                          <strong>
                            Queue Number
                          </strong>

                          <span>
                            #
                            {booking.queueNumber ||
                              "N/A"}
                          </span>

                        </div>
                      )}

                      {/* Rejected */}

                      {booking.status ===
                        "rejected" && (

                        <div className="rejected-info">

                          <strong>
                            Rejection Reason
                          </strong>

                          <span>
                            {booking.rejectionReason ||
                              "No reason provided"}
                          </span>

                        </div>
                      )}

                    </div>

                  </details>
                );
              })}

            </div>
          )}

      </main>

      {/* =========================
          CSS
      ========================= */}

      <style>{`

        .data-entry-page {
          min-height: 100vh;
          background: #f5f7fb;
          color: #1e293b;
          font-family: Arial, sans-serif;
        }

        .data-entry-header {
          background: #0c2340;
          color: white;
          padding: 18px 40px;

          display: flex;
          justify-content: space-between;
          align-items: center;

          box-shadow:
            0 2px 10px
            rgba(0, 0, 0, 0.08);
        }

        .data-entry-header h2 {
          margin: 0;
          font-size: 21px;
        }

        .data-entry-header p {
          margin: 5px 0 0;
          color: #cbd5e1;
          font-size: 13px;
        }

        .logout-btn {
          border: none;
          background: white;
          color: #0c2340;

          padding: 9px 18px;
          border-radius: 7px;

          cursor: pointer;
          font-weight: bold;
        }

        .data-entry-main {
          max-width: 1300px;
          margin: auto;
          padding: 35px;
        }

        .dashboard-title {
          display: flex;
          justify-content: space-between;
          align-items: center;

          margin-bottom: 20px;
        }

        .dashboard-title h1 {
          margin: 0;
          font-size: 28px;
          color: #0f172a;
        }

        .dashboard-title p {
          margin-top: 7px;
          color: #64748b;
        }

        .booking-count {
          background: white;
          border: 1px solid #e2e8f0;

          padding: 10px 16px;
          border-radius: 8px;

          font-weight: bold;
          color: #0c2340;
        }

        /* =========================
           Bulk Actions
        ========================= */

        .bulk-actions {
          background: white;
          border: 1px solid #e2e8f0;

          padding: 15px;

          border-radius: 10px;

          display: flex;
          gap: 10px;

          margin-bottom: 25px;

          flex-wrap: wrap;
        }

        .bulk-actions button {
          border: none;
          padding: 10px 15px;

          border-radius: 7px;

          cursor: pointer;

          font-weight: bold;
        }

        .select-all-btn {
          background: #e2e8f0;
          color: #334155;
        }

        .clear-btn {
          background: #f1f5f9;
          color: #475569;
        }

        .bulk-approve-btn {
          background: #16a34a;
          color: white;
        }

        .bulk-reject-btn {
          background: #dc2626;
          color: white;
        }

        .bulk-actions button:disabled {
          background: #cbd5e1;
          color: #64748b;
          cursor: not-allowed;
        }

        .booking-grid {
          display: grid;

          grid-template-columns:
            repeat(
              auto-fill,
              minmax(340px, 1fr)
            );

          gap: 20px;

          align-items: start;
        }

        .booking-card {
          background: white;

          border: 1px solid #e2e8f0;

          border-radius: 12px;

          overflow: hidden;

          box-shadow:
            0 3px 10px
            rgba(15, 23, 42, 0.05);

          transition: 0.2s;
        }

        .selected-card {
          border: 2px solid #0c2340;
        }

        .booking-card-header {
          list-style: none;

          cursor: pointer;

          padding: 20px;

          display: flex;

          justify-content:
            space-between;

          align-items:
            flex-start;

          gap: 15px;
        }

        .booking-card-header::-webkit-details-marker {
          display: none;
        }

        .patient-info {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .patient-info input {
          width: 17px;
          height: 17px;
          cursor: pointer;
        }

        .patient-avatar {
          width: 44px;
          height: 44px;

          border-radius: 50%;

          background: #e8eef7;
          color: #0c2340;

          display: flex;
          align-items: center;
          justify-content: center;

          font-weight: bold;
          font-size: 18px;
        }

        .patient-info h3 {
          margin: 0 0 5px;

          font-size: 16px;

          color: #0f172a;
        }

        .patient-info p {
          margin: 0;

          color: #64748b;

          font-size: 12px;
        }

        .card-header-right {
          display: flex;

          align-items: center;

          gap: 8px;
        }

        .queue-number {
          background: #dbeafe;
          color: #1d4ed8;

          padding: 5px 9px;

          border-radius: 20px;

          font-size: 12px;

          font-weight: bold;
        }

        .status-badge {
          padding: 5px 9px;

          border-radius: 20px;

          font-size: 11px;

          font-weight: bold;

          white-space: nowrap;
        }

        .status-pending {
          background: #fef3c7;
          color: #b45309;
        }

        .status-approved {
          background: #dcfce7;
          color: #15803d;
        }

        .status-rejected {
          background: #fee2e2;
          color: #b91c1c;
        }

        .status-exported {
          background: #e0e7ff;
          color: #4338ca;
        }

        .booking-card-details {
          border-top:
            1px solid #e2e8f0;

          padding: 20px;
        }

        .details-grid {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 16px;
        }

        .detail-item {
          display: flex;

          flex-direction: column;

          gap: 5px;
        }

        .detail-item span {
          color: #94a3b8;

          font-size: 11px;
        }

        .detail-item strong {
          color: #334155;

          font-size: 13px;
        }

        .booking-actions {
          display: flex;

          gap: 10px;

          margin-top: 22px;

          padding-top: 18px;

          border-top:
            1px solid #e2e8f0;
        }

        .approve-btn,
        .reject-btn {
          width: 50%;

          border: none;

          padding: 11px;

          border-radius: 7px;

          cursor: pointer;

          font-weight: bold;

          font-size: 13px;
        }

        .approve-btn {
          background: #16a34a;
          color: white;
        }

        .reject-btn {
          background: #dc2626;
          color: white;
        }

        .approved-info {
          margin-top: 20px;

          padding: 14px;

          border-radius: 8px;

          display: flex;

          justify-content:
            space-between;

          align-items: center;

          background: #f0fdf4;

          color: #166534;
        }

        .approved-info span {
          font-size: 22px;
          font-weight: bold;
        }

        .rejected-info {
          margin-top: 20px;

          padding: 14px;

          border-radius: 8px;

          background: #fef2f2;

          color: #991b1b;

          display: flex;

          flex-direction: column;

          gap: 5px;
        }

        .empty-box {
          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 12px;

          padding: 60px 20px;

          text-align: center;

          color: #64748b;
        }

        @media (max-width: 700px) {

          .data-entry-header {
            padding: 15px 20px;
          }

          .data-entry-main {
            padding: 20px;
          }

          .dashboard-title {
            align-items: flex-start;

            flex-direction: column;

            gap: 15px;
          }

          .booking-grid {
            grid-template-columns: 1fr;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .card-header-right {
            flex-direction: column;
          }

          .bulk-actions {
            flex-direction: column;
          }

          .bulk-actions button {
            width: 100%;
          }
        }

      `}</style>

    </div>
  );
};

export default DataEntryDashboard;
