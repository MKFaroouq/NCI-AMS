// import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";

// const AdminDashboard = () => {

//   // =========================================================
//   // State
//   // =========================================================

//   const [bookings, setBookings] = useState([]);
//   const [clinics, setClinics] = useState([]);
//   const [employees, setEmployees] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [activeSection, setActiveSection] = useState("overview");

//   const [searchNationalId, setSearchNationalId] = useState("");
//   const [patientBookings, setPatientBookings] = useState([]);

//   const [clinicName, setClinicName] = useState("");
//   const [clinicQuota, setClinicQuota] = useState(100);

//   const [employeeUsername, setEmployeeUsername] = useState("");
//   const [employeePassword, setEmployeePassword] = useState("");

//   // =========================================================
//   // API URL
//   // =========================================================

//   const API_URL = "http://localhost:8000/api";

//   // =========================================================
//   // Get Token
//   // =========================================================

//   const getToken = () => {
//     return localStorage.getItem("token");
//   };

//   // =========================================================
//   // Check Authentication
//   // =========================================================

//   useEffect(() => {

//     const token = getToken();

//     if (!token) {
//       window.location.href = "/login";
//       return;
//     }

//     loadDashboard();

//   }, []);

//   // =========================================================
//   // Load Dashboard Data
//   // =========================================================

//   const loadDashboard = async () => {

//     try {

//       const token = getToken();

//       setLoading(true);

//       // Get bookings
//       const bookingsResponse = await fetch(
//         `${API_URL}/bookings`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const bookingsData = await bookingsResponse.json();

//       if (bookingsResponse.ok) {
//         setBookings(
//           bookingsData.data?.bookings ||
//           bookingsData.bookings ||
//           []
//         );
//       }

//       // Get clinics
//       try {

//         const clinicsResponse = await fetch(
//           `${API_URL}/clinics`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const clinicsData =
//           await clinicsResponse.json();

//         if (clinicsResponse.ok) {

//           setClinics(
//             clinicsData.data?.clinics ||
//             clinicsData.clinics ||
//             []
//           );

//         }

//       } catch (error) {

//         console.log(
//           "Clinics API not available yet."
//         );

//       }

//       // Get employees
//       try {

//         const employeesResponse = await fetch(
//           `${API_URL}/employees`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const employeesData =
//           await employeesResponse.json();

//         if (employeesResponse.ok) {

//           setEmployees(
//             employeesData.data?.employees ||
//             employeesData.employees ||
//             []
//           );

//         }

//       } catch (error) {

//         console.log(
//           "Employees API not available yet."
//         );

//       }

//     } catch (error) {

//       console.error(
//         "Dashboard Error:",
//         error
//       );

//       Swal.fire({
//         title: "Error",
//         text: "Failed to load dashboard data.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });

//     } finally {

//       setLoading(false);

//     }

//   };

//   // =========================================================
//   // Dashboard Statistics
//   // =========================================================

//   const totalBookings = bookings.length;

//   const pendingBookings =
//     bookings.filter(
//       (booking) =>
//         booking.status === "pending"
//     ).length;

//   const approvedBookings =
//     bookings.filter(
//       (booking) =>
//         booking.status === "approved"
//     ).length;

//   const rejectedBookings =
//     bookings.filter(
//       (booking) =>
//         booking.status === "rejected"
//     ).length;

//   // =========================================================
//   // Search Patient
//   // =========================================================

//   const searchPatient = async () => {

//     if (!searchNationalId.trim()) {

//       Swal.fire({
//         title: "Missing National ID",
//         text: "Please enter the patient's National ID.",
//         icon: "warning",
//         confirmButtonText: "OK",
//       });

//       return;
//     }

//     try {

//       const token = getToken();

//       const response = await fetch(
//         `${API_URL}/bookings/patient/${searchNationalId}`,
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
//           data.error ||
//           data.message ||
//           "Patient not found"
//         );

//       }

//       setPatientBookings(
//         data.data?.bookings ||
//         data.bookings ||
//         []
//       );

//     } catch (error) {

//       console.error(
//         "Patient Search Error:",
//         error
//       );

//       setPatientBookings([]);

//       Swal.fire({
//         title: "Patient Not Found",
//         text: error.message,
//         icon: "warning",
//         confirmButtonText: "OK",
//       });

//     }

//   };

//   // =========================================================
//   // Add Clinic
//   // =========================================================

//   const handleAddClinic = async (e) => {

//     e.preventDefault();

//     if (!clinicName.trim()) {

//       Swal.fire({
//         title: "Missing Clinic Name",
//         text: "Please enter clinic name.",
//         icon: "warning",
//         confirmButtonText: "OK",
//       });

//       return;
//     }

//     try {

//       const token = getToken();

//       const response = await fetch(
//         `${API_URL}/clinics`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             name: clinicName,
//             quota: Number(clinicQuota),
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {

//         throw new Error(
//           data.error ||
//           data.message ||
//           "Failed to create clinic"
//         );

//       }

//       Swal.fire({
//         title: "Clinic Added",
//         text: "Clinic created successfully.",
//         icon: "success",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       setClinicName("");
//       setClinicQuota(100);

//       loadDashboard();

//     } catch (error) {

//       console.error(
//         "Add Clinic Error:",
//         error
//       );

//       Swal.fire({
//         title: "Error",
//         text: error.message,
//         icon: "error",
//         confirmButtonText: "OK",
//       });

//     }

//   };

//   // =========================================================
//   // Create Data Entry Employee
//   // =========================================================

//   const handleCreateEmployee = async (e) => {

//     e.preventDefault();

//     if (
//       !employeeUsername.trim() ||
//       !employeePassword.trim()
//     ) {

//       Swal.fire({
//         title: "Missing Data",
//         text: "Username and password are required.",
//         icon: "warning",
//         confirmButtonText: "OK",
//       });

//       return;
//     }

//     try {

//       const token = getToken();

//       const response = await fetch(
//         `${API_URL}/employees`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             username: employeeUsername,
//             password: employeePassword,
//             role: "DataEntry",
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {

//         throw new Error(
//           data.error ||
//           data.message ||
//           "Failed to create employee"
//         );

//       }

//       Swal.fire({
//         title: "Employee Created",
//         text: "Data Entry employee created successfully.",
//         icon: "success",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       setEmployeeUsername("");
//       setEmployeePassword("");

//       loadDashboard();

//     } catch (error) {

//       console.error(
//         "Create Employee Error:",
//         error
//       );

//       Swal.fire({
//         title: "Error",
//         text: error.message,
//         icon: "error",
//         confirmButtonText: "OK",
//       });

//     }

//   };

//   // =========================================================
//   // Logout
//   // =========================================================

//   const handleLogout = () => {

//     localStorage.removeItem("token");

//     window.location.href = "/login";

//   };

//   // =========================================================
//   // Format Date
//   // =========================================================

//   const formatDate = (date) => {

//     if (!date) {
//       return "N/A";
//     }

//     return new Date(date).toLocaleDateString(
//       "en-GB"
//     );

//   };

//   // =========================================================
//   // Render
//   // =========================================================

//   return (

//     <div
//       className="admin-page"
//       dir="ltr"
//     >

//       {/* =====================================================
//           HEADER
//       ====================================================== */}

//       <header className="admin-header">

//         <div>

//           <h2>
//             Admin Dashboard
//           </h2>

//           <p>
//             NCI Queue Management System
//           </p>

//         </div>

//         <button
//           className="logout-btn"
//           onClick={handleLogout}
//         >
//           Logout
//         </button>

//       </header>

//       {/* =====================================================
//           MAIN LAYOUT
//       ====================================================== */}

//       <div className="admin-layout">

//         {/* ===================================================
//             SIDEBAR
//         ==================================================== */}

//         <aside className="admin-sidebar">

//           <button
//             className={
//               activeSection === "overview"
//                 ? "menu-btn active"
//                 : "menu-btn"
//             }
//             onClick={() =>
//               setActiveSection("overview")
//             }
//           >
//             Dashboard
//           </button>

//           <button
//             className={
//               activeSection === "clinics"
//                 ? "menu-btn active"
//                 : "menu-btn"
//             }
//             onClick={() =>
//               setActiveSection("clinics")
//             }
//           >
//             Clinics
//           </button>

//           <button
//             className={
//               activeSection === "employees"
//                 ? "menu-btn active"
//                 : "menu-btn"
//             }
//             onClick={() =>
//               setActiveSection("employees")
//             }
//           >
//             Employees
//           </button>

//           <button
//             className={
//               activeSection === "bookings"
//                 ? "menu-btn active"
//                 : "menu-btn"
//             }
//             onClick={() =>
//               setActiveSection("bookings")
//             }
//           >
//             Bookings
//           </button>

//           <button
//             className={
//               activeSection === "patients"
//                 ? "menu-btn active"
//                 : "menu-btn"
//             }
//             onClick={() =>
//               setActiveSection("patients")
//             }
//           >
//             Patients
//           </button>

//         </aside>

//         {/* ===================================================
//             CONTENT
//         ==================================================== */}

//         <main className="admin-content">

//           {/* =================================================
//               OVERVIEW
//           ================================================== */}

//           {activeSection === "overview" && (

//             <>

//               <div className="page-title">

//                 <div>

//                   <h1>
//                     Dashboard Overview
//                   </h1>

//                   <p>
//                     Monitor the NCI-Q system.
//                   </p>

//                 </div>

//                 <button
//                   className="refresh-btn"
//                   onClick={loadDashboard}
//                 >
//                   Refresh
//                 </button>

//               </div>

//               {/* Statistics */}

//               <div className="stats-grid">

//                 <div className="stat-card">

//                   <span>
//                     Total Bookings
//                   </span>

//                   <strong>
//                     {totalBookings}
//                   </strong>

//                 </div>

//                 <div className="stat-card pending">

//                   <span>
//                     Pending
//                   </span>

//                   <strong>
//                     {pendingBookings}
//                   </strong>

//                 </div>

//                 <div className="stat-card approved">

//                   <span>
//                     Approved
//                   </span>

//                   <strong>
//                     {approvedBookings}
//                   </strong>

//                 </div>

//                 <div className="stat-card rejected">

//                   <span>
//                     Rejected
//                   </span>

//                   <strong>
//                     {rejectedBookings}
//                   </strong>

//                 </div>

//                 <div className="stat-card">

//                   <span>
//                     Clinics
//                   </span>

//                   <strong>
//                     {clinics.length}
//                   </strong>

//                 </div>

//                 <div className="stat-card">

//                   <span>
//                     Employees
//                   </span>

//                   <strong>
//                     {employees.length}
//                   </strong>

//                 </div>

//               </div>

//               {/* Quick Actions */}

//               <div className="section-title">

//                 <h2>
//                   Quick Actions
//                 </h2>

//               </div>

//               <div className="quick-grid">

//                 <button
//                   className="quick-card"
//                   onClick={() =>
//                     setActiveSection("clinics")
//                   }
//                 >
//                   <strong>
//                     Manage Clinics
//                   </strong>

//                   <span>
//                     Add and manage clinics
//                   </span>
//                 </button>

//                 <button
//                   className="quick-card"
//                   onClick={() =>
//                     setActiveSection("employees")
//                   }
//                 >
//                   <strong>
//                     Manage Employees
//                   </strong>

//                   <span>
//                     Create Data Entry accounts
//                   </span>
//                 </button>

//                 <button
//                   className="quick-card"
//                   onClick={() =>
//                     setActiveSection("bookings")
//                   }
//                 >
//                   <strong>
//                     View Bookings
//                   </strong>

//                   <span>
//                     View all booking requests
//                   </span>
//                 </button>

//                 <button
//                   className="quick-card"
//                   onClick={() =>
//                     setActiveSection("patients")
//                   }
//                 >
//                   <strong>
//                     Search Patients
//                   </strong>

//                   <span>
//                     Find patient booking history
//                   </span>
//                 </button>

//               </div>

//             </>

//           )}

//           {/* =================================================
//               CLINICS
//           ================================================== */}

//           {activeSection === "clinics" && (

//             <>

//               <div className="page-title">

//                 <div>

//                   <h1>
//                     Clinics Management
//                   </h1>

//                   <p>
//                     Add and manage NCI clinics.
//                   </p>

//                 </div>

//               </div>

//               <div className="admin-two-columns">

//                 {/* Add Clinic */}

//                 <div className="admin-box">

//                   <h2>
//                     Add New Clinic
//                   </h2>

//                   <form
//                     onSubmit={handleAddClinic}
//                   >

//                     <label>
//                       Clinic Name
//                     </label>

//                     <input
//                       type="text"
//                       value={clinicName}
//                       onChange={(e) =>
//                         setClinicName(
//                           e.target.value
//                         )
//                       }
//                       placeholder="Clinic name"
//                     />

//                     <label>
//                       Daily Quota
//                     </label>

//                     <input
//                       type="number"
//                       min="1"
//                       value={clinicQuota}
//                       onChange={(e) =>
//                         setClinicQuota(
//                           e.target.value
//                         )
//                       }
//                     />

//                     <button
//                       type="submit"
//                       className="primary-btn"
//                     >
//                       Add Clinic
//                     </button>

//                   </form>

//                 </div>

//                 {/* Clinics List */}

//                 <div className="admin-box">

//                   <h2>
//                     Existing Clinics
//                   </h2>

//                   {clinics.length === 0 ? (

//                     <p className="empty-text">
//                       No clinics found.
//                     </p>

//                   ) : (

//                     <div className="simple-list">

//                       {clinics.map(
//                         (clinic) => (

//                           <div
//                             className="list-row"
//                             key={clinic._id}
//                           >

//                             <div>

//                               <strong>
//                                 {clinic.name}
//                               </strong>

//                               <span>
//                                 Quota:{" "}
//                                 {
//                                   clinic.quota
//                                 }
//                               </span>

//                             </div>

//                             <span
//                               className={
//                                 clinic.isActive
//                                   ? "active-label"
//                                   : "inactive-label"
//                               }
//                             >
//                               {clinic.isActive
//                                 ? "Active"
//                                 : "Inactive"}
//                             </span>

//                           </div>

//                         )
//                       )}

//                     </div>

//                   )}

//                 </div>

//               </div>

//             </>

//           )}

//           {/* =================================================
//               EMPLOYEES
//           ================================================== */}

//           {activeSection === "employees" && (

//             <>

//               <div className="page-title">

//                 <div>

//                   <h1>
//                     Employee Management
//                   </h1>

//                   <p>
//                     Create and manage Data Entry accounts.
//                   </p>

//                 </div>

//               </div>

//               <div className="admin-two-columns">

//                 {/* Create Employee */}

//                 <div className="admin-box">

//                   <h2>
//                     Create Data Entry
//                   </h2>

//                   <form
//                     onSubmit={
//                       handleCreateEmployee
//                     }
//                   >

//                     <label>
//                       Username
//                     </label>

//                     <input
//                       type="text"
//                       value={
//                         employeeUsername
//                       }
//                       onChange={(e) =>
//                         setEmployeeUsername(
//                           e.target.value
//                         )
//                       }
//                       placeholder="Username"
//                     />

//                     <label>
//                       Password
//                     </label>

//                     <input
//                       type="password"
//                       value={
//                         employeePassword
//                       }
//                       onChange={(e) =>
//                         setEmployeePassword(
//                           e.target.value
//                         )
//                       }
//                       placeholder="Password"
//                     />

//                     <button
//                       type="submit"
//                       className="primary-btn"
//                     >
//                       Create Employee
//                     </button>

//                   </form>

//                 </div>

//                 {/* Employees */}

//                 <div className="admin-box">

//                   <h2>
//                     Employees
//                   </h2>

//                   {employees.length === 0 ? (

//                     <p className="empty-text">
//                       No employees found.
//                     </p>

//                   ) : (

//                     <div className="simple-list">

//                       {employees.map(
//                         (employee) => (

//                           <div
//                             className="list-row"
//                             key={employee._id}
//                           >

//                             <div>

//                               <strong>
//                                 {
//                                   employee.username
//                                 }
//                               </strong>

//                               <span>
//                                 Role:{" "}
//                                 {
//                                   employee.role
//                                 }
//                               </span>

//                             </div>

//                             <span
//                               className={
//                                 employee.isActive !==
//                                   false
//                                   ? "active-label"
//                                   : "inactive-label"
//                               }
//                             >
//                               {employee.isActive !==
//                               false
//                                 ? "Active"
//                                 : "Inactive"}
//                             </span>

//                           </div>

//                         )
//                       )}

//                     </div>

//                   )}

//                 </div>

//               </div>

//             </>

//           )}

//           {/* =================================================
//               BOOKINGS
//           ================================================== */}

//           {activeSection === "bookings" && (

//             <>

//               <div className="page-title">

//                 <div>

//                   <h1>
//                     All Bookings
//                   </h1>

//                   <p>
//                     View all booking requests.
//                   </p>

//                 </div>

//               </div>

//               {loading ? (

//                 <div className="admin-box">
//                   Loading bookings...
//                 </div>

//               ) : bookings.length === 0 ? (

//                 <div className="admin-box">
//                   No bookings found.
//                 </div>

//               ) : (

//                 <div className="booking-table">

//                   <div className="table-header">

//                     <span>
//                       Patient
//                     </span>

//                     <span>
//                       National ID
//                     </span>

//                     <span>
//                       Clinic
//                     </span>

//                     <span>
//                       Status
//                     </span>

//                     <span>
//                       Queue
//                     </span>

//                     <span>
//                       Date
//                     </span>

//                   </div>

//                   {bookings.map(
//                     (booking) => (

//                       <div
//                         className="table-row"
//                         key={booking._id}
//                       >

//                         <span>
//                           {
//                             booking.patientName
//                           }
//                         </span>

//                         <span>
//                           {
//                             booking.nationalId
//                           }
//                         </span>

//                         <span>
//                           {
//                             booking.clinicId?.name ||
//                             "Unknown"
//                           }
//                         </span>

//                         <span>
//                           <b
//                             className={
//                               `status ${booking.status}`
//                             }
//                           >
//                             {
//                               booking.status
//                             }
//                           </b>
//                         </span>

//                         <span>
//                           {
//                             booking.queueNumber ||
//                             "-"
//                           }
//                         </span>

//                         <span>
//                           {
//                             formatDate(
//                               booking.bookingDate
//                             )
//                           }
//                         </span>

//                       </div>

//                     )
//                   )}

//                 </div>

//               )}

//             </>

//           )}

//           {/* =================================================
//               PATIENTS
//           ================================================== */}

//           {activeSection === "patients" && (

//             <>

//               <div className="page-title">

//                 <div>

//                   <h1>
//                     Patient Search
//                   </h1>

//                   <p>
//                     Search patient booking history using National ID.
//                   </p>

//                 </div>

//               </div>

//               <div className="search-box">

//                 <input
//                   type="text"
//                   value={
//                     searchNationalId
//                   }
//                   onChange={(e) =>
//                     setSearchNationalId(
//                       e.target.value
//                     )
//                   }
//                   placeholder="Enter 14 digit National ID"
//                 />

//                 <button
//                   className="primary-btn"
//                   onClick={searchPatient}
//                 >
//                   Search
//                 </button>

//               </div>

//               {patientBookings.length >
//                 0 && (

//                 <div className="patient-results">

//                   <h2>
//                     Booking History
//                   </h2>

//                   <div className="booking-grid">

//                     {patientBookings.map(
//                       (booking) => (

//                         <div
//                           className="patient-card"
//                           key={booking._id}
//                         >

//                           <h3>
//                             {
//                               booking.patientName
//                             }
//                           </h3>

//                           <p>
//                             <strong>
//                               Clinic:
//                             </strong>{" "}
//                             {
//                               booking.clinicId
//                                 ?.name ||
//                               "Unknown"
//                             }
//                           </p>

//                           <p>
//                             <strong>
//                               Status:
//                             </strong>{" "}
//                             {
//                               booking.status
//                             }
//                           </p>

//                           <p>
//                             <strong>
//                               Queue:
//                             </strong>{" "}
//                             {
//                               booking.queueNumber ||
//                               "-"
//                             }
//                           </p>

//                           <p>
//                             <strong>
//                               Date:
//                             </strong>{" "}
//                             {
//                               formatDate(
//                                 booking.bookingDate
//                               )
//                             }
//                           </p>

//                         </div>

//                       )
//                     )}

//                   </div>

//                 </div>

//               )}

//             </>

//           )}

//         </main>

//       </div>

//       {/* =====================================================
//           CSS
//       ====================================================== */}

//       <style>{`

//         * {
//           box-sizing: border-box;
//         }

//         .admin-page {
//           min-height: 100vh;
//           background: #f5f7fb;
//           color: #1e293b;
//           font-family: Arial, sans-serif;
//         }

//         /* Header */

//         .admin-header {
//           background: #0c2340;
//           color: white;
//           padding: 18px 35px;

//           display: flex;
//           justify-content: space-between;
//           align-items: center;

//           box-shadow:
//             0 2px 10px
//             rgba(0,0,0,0.08);
//         }

//         .admin-header h2 {
//           margin: 0;
//           font-size: 21px;
//         }

//         .admin-header p {
//           margin: 5px 0 0;
//           color: #cbd5e1;
//           font-size: 13px;
//         }

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

//         /* Layout */

//         .admin-layout {
//           display: flex;
//           min-height: calc(100vh - 75px);
//         }

//         /* Sidebar */

//         .admin-sidebar {
//           width: 220px;
//           background: white;

//           border-right:
//             1px solid #e2e8f0;

//           padding: 25px 15px;
//         }

//         .menu-btn {
//           width: 100%;

//           border: none;
//           background: transparent;

//           text-align: left;

//           padding: 12px 15px;

//           margin-bottom: 7px;

//           border-radius: 7px;

//           cursor: pointer;

//           color: #475569;

//           font-size: 14px;
//         }

//         .menu-btn:hover {
//           background: #f1f5f9;
//         }

//         .menu-btn.active {
//           background: #e8eef7;
//           color: #0c2340;
//           font-weight: bold;
//         }

//         /* Content */

//         .admin-content {
//           flex: 1;
//           padding: 35px;

//           max-width: 1400px;
//         }

//         /* Page Title */

//         .page-title {
//           display: flex;

//           justify-content:
//             space-between;

//           align-items: center;

//           margin-bottom: 30px;
//         }

//         .page-title h1 {
//           margin: 0;

//           color: #0f172a;

//           font-size: 27px;
//         }

//         .page-title p {
//           margin-top: 7px;

//           color: #64748b;
//         }

//         .refresh-btn {
//           border: 1px solid #cbd5e1;

//           background: white;

//           padding: 9px 15px;

//           border-radius: 7px;

//           cursor: pointer;
//         }

//         /* Statistics */

//         .stats-grid {
//           display: grid;

//           grid-template-columns:
//             repeat(
//               auto-fit,
//               minmax(180px, 1fr)
//             );

//           gap: 18px;

//           margin-bottom: 35px;
//         }

//         .stat-card {
//           background: white;

//           border:
//             1px solid #e2e8f0;

//           border-radius: 11px;

//           padding: 22px;

//           box-shadow:
//             0 3px 10px
//             rgba(15,23,42,0.04);
//         }

//         .stat-card span {
//           display: block;

//           color: #64748b;

//           font-size: 13px;

//           margin-bottom: 10px;
//         }

//         .stat-card strong {
//           font-size: 30px;

//           color: #0c2340;
//         }

//         .stat-card.pending strong {
//           color: #d97706;
//         }

//         .stat-card.approved strong {
//           color: #16a34a;
//         }

//         .stat-card.rejected strong {
//           color: #dc2626;
//         }

//         /* Quick Actions */

//         .section-title {
//           margin-bottom: 15px;
//         }

//         .section-title h2 {
//           color: #0f172a;
//         }

//         .quick-grid {
//           display: grid;

//           grid-template-columns:
//             repeat(
//               auto-fit,
//               minmax(220px, 1fr)
//             );

//           gap: 18px;
//         }

//         .quick-card {
//           background: white;

//           border:
//             1px solid #e2e8f0;

//           border-radius: 11px;

//           padding: 22px;

//           text-align: left;

//           cursor: pointer;

//           transition: 0.2s;
//         }

//         .quick-card:hover {
//           transform: translateY(-2px);

//           box-shadow:
//             0 7px 18px
//             rgba(15,23,42,0.08);
//         }

//         .quick-card strong {
//           display: block;

//           color: #0c2340;

//           margin-bottom: 7px;
//         }

//         .quick-card span {
//           color: #64748b;

//           font-size: 13px;
//         }

//         /* Two Columns */

//         .admin-two-columns {
//           display: grid;

//           grid-template-columns:
//             minmax(300px, 400px)
//             1fr;

//           gap: 20px;
//         }

//         /* Box */

//         .admin-box {
//           background: white;

//           border:
//             1px solid #e2e8f0;

//           border-radius: 11px;

//           padding: 22px;

//           margin-bottom: 20px;
//         }

//         .admin-box h2 {
//           margin-top: 0;

//           color: #0c2340;

//           font-size: 18px;
//         }

//         .admin-box form {
//           display: flex;

//           flex-direction: column;

//           gap: 9px;
//         }

//         .admin-box label {
//           color: #475569;

//           font-size: 13px;

//           margin-top: 8px;
//         }

//         .admin-box input,
//         .search-box input {
//           padding: 11px;

//           border:
//             1px solid #cbd5e1;

//           border-radius: 7px;

//           outline: none;
//         }

//         .admin-box input:focus,
//         .search-box input:focus {
//           border-color: #0c2340;
//         }

//         .primary-btn {
//           border: none;

//           background: #0c2340;

//           color: white;

//           padding: 11px 18px;

//           border-radius: 7px;

//           cursor: pointer;

//           font-weight: bold;

//           margin-top: 10px;
//         }

//         .primary-btn:hover {
//           background: #16385f;
//         }

//         /* Lists */

//         .simple-list {
//           display: flex;

//           flex-direction: column;
//         }

//         .list-row {
//           display: flex;

//           justify-content:
//             space-between;

//           align-items: center;

//           padding: 14px 0;

//           border-bottom:
//             1px solid #e2e8f0;
//         }

//         .list-row:last-child {
//           border-bottom: none;
//         }

//         .list-row strong {
//           display: block;

//           color: #334155;

//           margin-bottom: 4px;
//         }

//         .list-row span {
//           color: #64748b;

//           font-size: 12px;
//         }

//         .active-label {
//           color: #15803d !important;

//           font-weight: bold;
//         }

//         .inactive-label {
//           color: #dc2626 !important;

//           font-weight: bold;
//         }

//         .empty-text {
//           color: #64748b;
//         }

//         /* Booking Table */

//         .booking-table {
//           background: white;

//           border:
//             1px solid #e2e8f0;

//           border-radius: 11px;

//           overflow: hidden;
//         }

//         .table-header,
//         .table-row {
//           display: grid;

//           grid-template-columns:
//             1.3fr
//             1.2fr
//             1fr
//             .8fr
//             .6fr
//             .9fr;

//           gap: 15px;

//           padding: 15px 18px;

//           align-items: center;
//         }

//         .table-header {
//           background: #f8fafc;

//           color: #64748b;

//           font-size: 12px;

//           font-weight: bold;
//         }

//         .table-row {
//           border-top:
//             1px solid #e2e8f0;

//           font-size: 13px;

//           color: #334155;
//         }

//         .status {
//           padding: 5px 8px;

//           border-radius: 15px;

//           font-size: 11px;
//         }

//         .status.pending {
//           background: #fef3c7;

//           color: #b45309;
//         }

//         .status.approved {
//           background: #dcfce7;

//           color: #15803d;
//         }

//         .status.rejected {
//           background: #fee2e2;

//           color: #b91c1c;
//         }

//         /* Search */

//         .search-box {
//           background: white;

//           border:
//             1px solid #e2e8f0;

//           border-radius: 11px;

//           padding: 20px;

//           display: flex;

//           gap: 10px;

//           max-width: 700px;

//           margin-bottom: 25px;
//         }

//         .search-box input {
//           flex: 1;
//         }

//         /* Patient Cards */

//         .booking-grid {
//           display: grid;

//           grid-template-columns:
//             repeat(
//               auto-fit,
//               minmax(280px, 1fr)
//             );

//           gap: 18px;
//         }

//         .patient-card {
//           background: white;

//           border:
//             1px solid #e2e8f0;

//           border-radius: 10px;

//           padding: 20px;
//         }

//         .patient-card h3 {
//           margin-top: 0;

//           color: #0c2340;
//         }

//         .patient-card p {
//           color: #475569;

//           font-size: 13px;
//         }

//         /* Mobile */

//         @media (max-width: 800px) {

//           .admin-layout {
//             flex-direction: column;
//           }

//           .admin-sidebar {
//             width: 100%;

//             display: flex;

//             overflow-x: auto;

//             padding: 10px;
//           }

//           .menu-btn {
//             min-width: 120px;

//             margin-right: 5px;

//             margin-bottom: 0;
//           }

//           .admin-content {
//             padding: 20px;
//           }

//           .admin-two-columns {
//             grid-template-columns: 1fr;
//           }

//           .table-header,
//           .table-row {
//             grid-template-columns:
//               1fr
//               1fr
//               1fr;
//           }

//           .table-header span:nth-child(n+4),
//           .table-row span:nth-child(n+4) {
//             display: none;
//           }

//         }

//       `}</style>

//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  // =========================
  // State
  // =========================

  const [clinics, setClinics] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState("overview");

  const [clinicName, setClinicName] = useState("");
  const [clinicQuota, setClinicQuota] = useState(100);

  const [addingClinic, setAddingClinic] = useState(false);

  // =========================
  // Get Clinics
  // =========================

  const getClinics = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/clinics"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to get clinics"
        );
      }

      setClinics(data.clinics || []);
    } catch (error) {
      console.error("Get Clinics Error:", error);

      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

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

      setBookings(
        data.data?.bookings ||
        data.bookings ||
        []
      );
    } catch (error) {
      console.error("Get Bookings Error:", error);

      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // =========================
  // Load Dashboard Data
  // =========================

  const loadDashboard = async () => {
    setLoading(true);

    await Promise.all([
      getClinics(),
      getBookings(),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =========================
  // Add Clinic
  // =========================

  const handleAddClinic = async (e) => {
    e.preventDefault();

    if (!clinicName.trim()) {
      Swal.fire({
        title: "Missing Data",
        text: "Please enter clinic name.",
        icon: "warning",
        confirmButtonText: "OK",
      });

      return;
    }

    try {
      setAddingClinic(true);

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/clinics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: clinicName,
            quota: Number(clinicQuota),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to add clinic"
        );
      }

      await Swal.fire({
        title: "Clinic Added",
        text: "The clinic was added successfully.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#0c2340",
      });

      // Clear form
      setClinicName("");
      setClinicQuota(100);

      // Refresh clinics
      getClinics();
    } catch (error) {
      console.error("Add Clinic Error:", error);

      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setAddingClinic(false);
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
  // Booking Statistics
  // =========================

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status === "pending"
  ).length;

  const approvedBookings = bookings.filter(
    (booking) =>
      booking.status === "approved"
  ).length;

  const rejectedBookings = bookings.filter(
    (booking) =>
      booking.status === "rejected"
  ).length;

  // =========================
  // Status Helper
  // =========================

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "Pending",
          className: "status-pending",
        };

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
          text: "Accepted",
          className: "status-exported",
        };

      default:
        return {
          text: status || "Unknown",
          className: "status-unknown",
        };
    }
  };

  // =========================
  // Render
  // =========================

  return (
    <div
      className="admin-page"
      dir="ltr"
    >

      {/* ========================= */}
      {/* Header */}
      {/* ========================= */}

      <header className="admin-header">

        <div>
          <h2>
            NCI-Q Admin Dashboard
          </h2>

          <p>
            System Administration
          </p>
        </div>

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>

      {/* ========================= */}
      {/* Dashboard Layout */}
      {/* ========================= */}

      <div className="admin-layout">

        {/* ========================= */}
        {/* Sidebar */}
        {/* ========================= */}

        <aside className="admin-sidebar">

          <button
            className={
              activeSection === "overview"
                ? "sidebar-btn active"
                : "sidebar-btn"
            }
            onClick={() =>
              setActiveSection("overview")
            }
          >
            Dashboard
          </button>

          <button
            className={
              activeSection === "clinics"
                ? "sidebar-btn active"
                : "sidebar-btn"
            }
            onClick={() =>
              setActiveSection("clinics")
            }
          >
            Clinics
          </button>

          <button
            className={
              activeSection === "bookings"
                ? "sidebar-btn active"
                : "sidebar-btn"
            }
            onClick={() =>
              setActiveSection("bookings")
            }
          >
            Bookings
          </button>

          <button
            className={
              activeSection === "patients"
                ? "sidebar-btn active"
                : "sidebar-btn"
            }
            onClick={() =>
              setActiveSection("patients")
            }
          >
            Patients
          </button>

        </aside>

        {/* ========================= */}
        {/* Main Content */}
        {/* ========================= */}

        <main className="admin-main">

          {/* ========================= */}
          {/* Loading */}
          {/* ========================= */}

          {loading && (
            <div className="loading-box">
              Loading dashboard...
            </div>
          )}

          {!loading && (
            <>

              {/* ================================================== */}
              {/* OVERVIEW */}
              {/* ================================================== */}

              {activeSection === "overview" && (
                <section>

                  <div className="section-header">

                    <div>
                      <h1>
                        Dashboard Overview
                      </h1>

                      <p>
                        System summary and statistics
                      </p>
                    </div>

                    <button
                      className="refresh-btn"
                      onClick={loadDashboard}
                    >
                      Refresh
                    </button>

                  </div>

                  {/* ========================= */}
                  {/* Statistics */}
                  {/* ========================= */}

                  <div className="stats-grid">

                    <div className="stat-card">
                      <span>
                        Total Bookings
                      </span>

                      <strong>
                        {totalBookings}
                      </strong>
                    </div>

                    <div className="stat-card pending-card">
                      <span>
                        Pending
                      </span>

                      <strong>
                        {pendingBookings}
                      </strong>
                    </div>

                    <div className="stat-card approved-card">
                      <span>
                        Approved
                      </span>

                      <strong>
                        {approvedBookings}
                      </strong>
                    </div>

                    <div className="stat-card rejected-card">
                      <span>
                        Rejected
                      </span>

                      <strong>
                        {rejectedBookings}
                      </strong>
                    </div>

                  </div>

                  {/* ========================= */}
                  {/* Quick Info */}
                  {/* ========================= */}

                  <div className="overview-grid">

                    <div className="dashboard-card">

                      <h3>
                        Clinics
                      </h3>

                      <p>
                        Active Clinics
                      </p>

                      <strong className="big-number">
                        {clinics.length}
                      </strong>

                    </div>

                    <div className="dashboard-card">

                      <h3>
                        Pending Requests
                      </h3>

                      <p>
                        Waiting for Data Entry review
                      </p>

                      <strong className="big-number">
                        {pendingBookings}
                      </strong>

                    </div>

                  </div>

                </section>
              )}

              {/* ================================================== */}
              {/* CLINICS */}
              {/* ================================================== */}

              {activeSection === "clinics" && (
                <section>

                  <div className="section-header">

                    <div>
                      <h1>
                        Clinics Management
                      </h1>

                      <p>
                        Add and view system clinics
                      </p>
                    </div>

                  </div>

                  {/* ========================= */}
                  {/* Add Clinic */}
                  {/* ========================= */}

                  <div className="dashboard-card">

                    <h3>
                      Add New Clinic
                    </h3>

                    <form
                      onSubmit={handleAddClinic}
                      className="clinic-form"
                    >

                      <div className="form-field">

                        <label>
                          Clinic Name
                        </label>

                        <input
                          type="text"
                          value={clinicName}
                          onChange={(e) =>
                            setClinicName(
                              e.target.value
                            )
                          }
                          placeholder="Enter clinic name"
                        />

                      </div>

                      <div className="form-field">

                        <label>
                          Daily Quota
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={clinicQuota}
                          onChange={(e) =>
                            setClinicQuota(
                              e.target.value
                            )
                          }
                        />

                      </div>

                      <button
                        type="submit"
                        className="primary-btn"
                        disabled={addingClinic}
                      >
                        {addingClinic
                          ? "Adding..."
                          : "Add Clinic"}
                      </button>

                    </form>

                  </div>

                  {/* ========================= */}
                  {/* Clinics List */}
                  {/* ========================= */}

                  <div className="dashboard-card">

                    <div className="card-header">

                      <h3>
                        Active Clinics
                      </h3>

                      <span>
                        {clinics.length}
                      </span>

                    </div>

                    {clinics.length === 0 ? (
                      <div className="empty-small">
                        No active clinics found.
                      </div>
                    ) : (
                      <div className="clinic-grid">

                        {clinics.map(
                          (clinic) => (
                            <div
                              className="clinic-card"
                              key={clinic._id}
                            >

                              <div>

                                <h3>
                                  {clinic.name}
                                </h3>

                                <p>
                                  Clinic ID:
                                  {" "}
                                  {clinic._id}
                                </p>

                              </div>

                              <div className="clinic-quota">

                                <span>
                                  Daily Quota
                                </span>

                                <strong>
                                  {clinic.quota}
                                </strong>

                              </div>

                            </div>
                          )
                        )}

                      </div>
                    )}

                  </div>

                </section>
              )}

              {/* ================================================== */}
              {/* BOOKINGS */}
              {/* ================================================== */}

              {activeSection === "bookings" && (
                <section>

                  <div className="section-header">

                    <div>
                      <h1>
                        Booking Management
                      </h1>

                      <p>
                        View all booking requests
                      </p>
                    </div>

                  </div>

                  {bookings.length === 0 ? (
                    <div className="empty-box">
                      No bookings found.
                    </div>
                  ) : (
                    <div className="booking-grid">

                      {bookings.map(
                        (booking) => {

                          const status =
                            getStatusInfo(
                              booking.status
                            );

                          return (
                            <div
                              className="booking-card"
                              key={booking._id}
                            >

                              <div className="booking-top">

                                <div>

                                  <h3>
                                    {
                                      booking.patientName
                                    }
                                  </h3>

                                  <p>
                                    ID:
                                    {" "}
                                    {
                                      booking.nationalId
                                    }
                                  </p>

                                </div>

                                <span
                                  className={
                                    `status-badge ${status.className}`
                                  }
                                >
                                  {status.text}
                                </span>

                              </div>

                              <div className="booking-details">

                                <p>
                                  <span>
                                    Phone
                                  </span>

                                  <strong>
                                    {
                                      booking.phoneNumber ||
                                      "N/A"
                                    }
                                  </strong>
                                </p>

                                <p>
                                  <span>
                                    Clinic
                                  </span>

                                  <strong>
                                    {
                                      booking.clinicId?.name ||
                                      "Unknown"
                                    }
                                  </strong>
                                </p>

                                <p>
                                  <span>
                                    Queue Number
                                  </span>

                                  <strong>
                                    {
                                      booking.queueNumber ||
                                      "N/A"
                                    }
                                  </strong>
                                </p>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>
                  )}

                </section>
              )}

              {/* ================================================== */}
              {/* PATIENTS */}
              {/* ================================================== */}

              {activeSection === "patients" && (
                <section>

                  <div className="section-header">

                    <div>
                      <h1>
                        Patients
                      </h1>

                      <p>
                        Patient information from booking requests
                      </p>
                    </div>

                  </div>

                  {bookings.length === 0 ? (
                    <div className="empty-box">
                      No patient records found.
                    </div>
                  ) : (
                    <div className="patient-table-wrapper">

                      <table className="patient-table">

                        <thead>

                          <tr>
                            <th>
                              Patient Name
                            </th>

                            <th>
                              National ID
                            </th>

                            <th>
                              Phone
                            </th>

                            <th>
                              Clinic
                            </th>

                            <th>
                              Status
                            </th>
                          </tr>

                        </thead>

                        <tbody>

                          {bookings.map(
                            (booking) => {

                              const status =
                                getStatusInfo(
                                  booking.status
                                );

                              return (
                                <tr
                                  key={
                                    booking._id
                                  }
                                >

                                  <td>
                                    {
                                      booking.patientName
                                    }
                                  </td>

                                  <td>
                                    {
                                      booking.nationalId
                                    }
                                  </td>

                                  <td>
                                    {
                                      booking.phoneNumber ||
                                      "N/A"
                                    }
                                  </td>

                                  <td>
                                    {
                                      booking.clinicId?.name ||
                                      "Unknown"
                                    }
                                  </td>

                                  <td>
                                    <span
                                      className={
                                        `status-badge ${status.className}`
                                      }
                                    >
                                      {status.text}
                                    </span>
                                  </td>

                                </tr>
                              );
                            }
                          )}

                        </tbody>

                      </table>

                    </div>
                  )}

                </section>
              )}

            </>
          )}

        </main>

      </div>

      {/* ========================= */}
      {/* CSS */}
      {/* ========================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .admin-page {
          min-height: 100vh;
          background: #f5f7fb;
          color: #1e293b;
          font-family: Arial, sans-serif;
        }

        /* ========================= */
        /* Header */
        /* ========================= */

        .admin-header {
          height: 75px;
          background: #0c2340;
          color: white;
          padding: 0 30px;

          display: flex;
          justify-content: space-between;
          align-items: center;

          box-shadow:
            0 2px 10px rgba(0, 0, 0, 0.08);
        }

        .admin-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .admin-header p {
          margin: 5px 0 0;
          color: #cbd5e1;
          font-size: 12px;
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

        .logout-btn:hover {
          background: #e2e8f0;
        }

        /* ========================= */
        /* Layout */
        /* ========================= */

        .admin-layout {
          display: flex;
          min-height: calc(100vh - 75px);
        }

        /* ========================= */
        /* Sidebar */
        /* ========================= */

        .admin-sidebar {
          width: 220px;
          background: white;

          border-right:
            1px solid #e2e8f0;

          padding: 25px 15px;
        }

        .sidebar-btn {
          width: 100%;

          border: none;
          background: transparent;

          padding: 13px 15px;
          margin-bottom: 6px;

          border-radius: 7px;

          text-align: left;

          cursor: pointer;

          color: #475569;

          font-size: 14px;
        }

        .sidebar-btn:hover {
          background: #f1f5f9;
        }

        .sidebar-btn.active {
          background: #e8eef7;
          color: #0c2340;
          font-weight: bold;
        }

        /* ========================= */
        /* Main */
        /* ========================= */

        .admin-main {
          flex: 1;
          padding: 35px;
          max-width: 1500px;
        }

        /* ========================= */
        /* Section Header */
        /* ========================= */

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          margin-bottom: 25px;
        }

        .section-header h1 {
          margin: 0;
          color: #0f172a;
          font-size: 28px;
        }

        .section-header p {
          margin: 7px 0 0;
          color: #64748b;
        }

        /* ========================= */
        /* Buttons */
        /* ========================= */

        .refresh-btn,
        .primary-btn {
          border: none;
          background: #0c2340;
          color: white;

          padding: 10px 18px;

          border-radius: 7px;

          cursor: pointer;
          font-weight: bold;
        }

        .refresh-btn:hover,
        .primary-btn:hover {
          background: #16385f;
        }

        .primary-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ========================= */
        /* Statistics */
        /* ========================= */

        .stats-grid {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 18px;

          margin-bottom: 25px;
        }

        .stat-card {
          background: white;

          border: 1px solid #e2e8f0;

          border-radius: 10px;

          padding: 22px;

          display: flex;
          flex-direction: column;

          gap: 10px;

          box-shadow:
            0 3px 10px
            rgba(15, 23, 42, 0.04);
        }

        .stat-card span {
          color: #64748b;
          font-size: 13px;
        }

        .stat-card strong {
          font-size: 30px;
          color: #0c2340;
        }

        .pending-card {
          border-top: 4px solid #f59e0b;
        }

        .approved-card {
          border-top: 4px solid #16a34a;
        }

        .rejected-card {
          border-top: 4px solid #dc2626;
        }

        /* ========================= */
        /* Dashboard Cards */
        /* ========================= */

        .overview-grid {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 20px;
        }

        .dashboard-card {
          background: white;

          border: 1px solid #e2e8f0;

          border-radius: 10px;

          padding: 25px;

          margin-bottom: 20px;

          box-shadow:
            0 3px 10px
            rgba(15, 23, 42, 0.04);
        }

        .dashboard-card h3 {
          margin: 0 0 7px;
          color: #0c2340;
        }

        .dashboard-card p {
          margin: 0 0 15px;
          color: #64748b;
          font-size: 13px;
        }

        .big-number {
          font-size: 32px;
          color: #0c2340;
        }

        /* ========================= */
        /* Clinic Form */
        /* ========================= */

        .clinic-form {
          display: flex;
          align-items: flex-end;
          gap: 15px;
        }

        .form-field {
          flex: 1;
        }

        .form-field label {
          display: block;

          margin-bottom: 7px;

          font-size: 13px;
          font-weight: bold;

          color: #475569;
        }

        .form-field input {
          width: 100%;

          padding: 11px;

          border:
            1px solid #cbd5e1;

          border-radius: 7px;

          outline: none;
        }

        .form-field input:focus {
          border-color: #0c2340;
        }

        /* ========================= */
        /* Card Header */
        /* ========================= */

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          margin-bottom: 20px;
        }

        .card-header h3 {
          margin: 0;
        }

        .card-header span {
          background: #e8eef7;
          color: #0c2340;

          padding: 5px 10px;

          border-radius: 20px;

          font-size: 12px;
          font-weight: bold;
        }

        /* ========================= */
        /* Clinics */
        /* ========================= */

        .clinic-grid {
          display: grid;

          grid-template-columns:
            repeat(
              auto-fill,
              minmax(250px, 1fr)
            );

          gap: 15px;
        }

        .clinic-card {
          border:
            1px solid #e2e8f0;

          border-radius: 9px;

          padding: 18px;

          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .clinic-card h3 {
          margin: 0 0 7px;
          color: #0c2340;
        }

        .clinic-card p {
          margin: 0;

          color: #94a3b8;

          font-size: 10px;

          word-break: break-all;
        }

        .clinic-quota {
          text-align: right;
        }

        .clinic-quota span {
          display: block;

          color: #94a3b8;

          font-size: 11px;
        }

        .clinic-quota strong {
          display: block;

          margin-top: 5px;

          color: #0c2340;

          font-size: 20px;
        }

        /* ========================= */
        /* Booking Grid */
        /* ========================= */

        .booking-grid {
          display: grid;

          grid-template-columns:
            repeat(
              auto-fill,
              minmax(320px, 1fr)
            );

          gap: 18px;
        }

        .booking-card {
          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 10px;

          padding: 20px;

          box-shadow:
            0 3px 10px
            rgba(15, 23, 42, 0.04);
        }

        .booking-top {
          display: flex;

          justify-content:
            space-between;

          align-items:
            flex-start;

          gap: 10px;

          margin-bottom: 18px;
        }

        .booking-top h3 {
          margin: 0 0 5px;

          color: #0c2340;
        }

        .booking-top p {
          margin: 0;

          color: #64748b;

          font-size: 12px;
        }

        .booking-details p {
          display: flex;

          justify-content:
            space-between;

          border-bottom:
            1px solid #f1f5f9;

          padding-bottom: 10px;

          margin-bottom: 10px;
        }

        .booking-details span {
          color: #94a3b8;
        }

        .booking-details strong {
          color: #334155;
        }

        /* ========================= */
        /* Status */
        /* ========================= */

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

        .status-unknown {
          background: #e2e8f0;
          color: #475569;
        }

        /* ========================= */
        /* Patient Table */
        /* ========================= */

        .patient-table-wrapper {
          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 10px;

          overflow-x: auto;
        }

        .patient-table {
          width: 100%;

          border-collapse:
            collapse;
        }

        .patient-table th {
          background: #f8fafc;

          color: #475569;

          text-align: left;

          padding: 15px;

          font-size: 12px;

          border-bottom:
            1px solid #e2e8f0;
        }

        .patient-table td {
          padding: 15px;

          border-bottom:
            1px solid #f1f5f9;

          font-size: 13px;
        }

        .patient-table tr:hover {
          background: #f8fafc;
        }

        /* ========================= */
        /* Empty */
        /* ========================= */

        .empty-box,
        .empty-small,
        .loading-box {
          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 10px;

          padding: 50px;

          text-align: center;

          color: #64748b;
        }

        .empty-small {
          padding: 30px;
        }

        /* ========================= */
        /* Mobile */
        /* ========================= */

        @media (max-width: 900px) {

          .admin-sidebar {
            width: 180px;
          }

          .stats-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .clinic-form {
            flex-direction: column;
            align-items: stretch;
          }

        }

        @media (max-width: 650px) {

          .admin-layout {
            flex-direction: column;
          }

          .admin-sidebar {
            width: 100%;

            display: flex;

            overflow-x: auto;

            padding: 10px;
          }

          .sidebar-btn {
            min-width: 120px;
          }

          .admin-main {
            padding: 20px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .overview-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

        }

      `}</style>

    </div>
  );
};

export default AdminDashboard;

