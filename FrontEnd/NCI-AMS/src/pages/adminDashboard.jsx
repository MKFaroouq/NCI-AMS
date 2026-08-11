import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdminDashboard = () => {

  // =========================================================
  // State
  // =========================================================

  const [bookings, setBookings] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState("overview");

  const [searchNationalId, setSearchNationalId] = useState("");
  const [patientBookings, setPatientBookings] = useState([]);

  const [clinicName, setClinicName] = useState("");
  const [clinicQuota, setClinicQuota] = useState(100);

  const [employeeUsername, setEmployeeUsername] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");

  // =========================================================
  // API URL
  // =========================================================

  const API_URL = "http://localhost:8000/api";

  // =========================================================
  // Get Token
  // =========================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================================================
  // Check Authentication
  // =========================================================

  useEffect(() => {

    const token = getToken();

    if (!token) {
      window.location.href = "/login";
      return;
    }

    loadDashboard();

  }, []);

  // =========================================================
  // Load Dashboard Data
  // =========================================================

  const loadDashboard = async () => {

    try {

      const token = getToken();

      setLoading(true);

      // Get bookings
      const bookingsResponse = await fetch(
        `${API_URL}/bookings`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const bookingsData = await bookingsResponse.json();

      if (bookingsResponse.ok) {
        setBookings(
          bookingsData.data?.bookings ||
          bookingsData.bookings ||
          []
        );
      }

      // Get clinics
      try {

        const clinicsResponse = await fetch(
          `${API_URL}/clinics`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const clinicsData =
          await clinicsResponse.json();

        if (clinicsResponse.ok) {

          setClinics(
            clinicsData.data?.clinics ||
            clinicsData.clinics ||
            []
          );

        }

      } catch (error) {

        console.log(
          "Clinics API not available yet."
        );

      }

      // Get employees
      try {

        const employeesResponse = await fetch(
          `${API_URL}/employees`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const employeesData =
          await employeesResponse.json();

        if (employeesResponse.ok) {

          setEmployees(
            employeesData.data?.employees ||
            employeesData.employees ||
            []
          );

        }

      } catch (error) {

        console.log(
          "Employees API not available yet."
        );

      }

    } catch (error) {

      console.error(
        "Dashboard Error:",
        error
      );

      Swal.fire({
        title: "Error",
        text: "Failed to load dashboard data.",
        icon: "error",
        confirmButtonText: "OK",
      });

    } finally {

      setLoading(false);

    }

  };

  // =========================================================
  // Dashboard Statistics
  // =========================================================

  const totalBookings = bookings.length;

  const pendingBookings =
    bookings.filter(
      (booking) =>
        booking.status === "pending"
    ).length;

  const approvedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "approved"
    ).length;

  const rejectedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "rejected"
    ).length;

  // =========================================================
  // Search Patient
  // =========================================================

  const searchPatient = async () => {

    if (!searchNationalId.trim()) {

      Swal.fire({
        title: "Missing National ID",
        text: "Please enter the patient's National ID.",
        icon: "warning",
        confirmButtonText: "OK",
      });

      return;
    }

    try {

      const token = getToken();

      const response = await fetch(
        `${API_URL}/bookings/patient/${searchNationalId}`,
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
          data.error ||
          data.message ||
          "Patient not found"
        );

      }

      setPatientBookings(
        data.data?.bookings ||
        data.bookings ||
        []
      );

    } catch (error) {

      console.error(
        "Patient Search Error:",
        error
      );

      setPatientBookings([]);

      Swal.fire({
        title: "Patient Not Found",
        text: error.message,
        icon: "warning",
        confirmButtonText: "OK",
      });

    }

  };

  // =========================================================
  // Add Clinic
  // =========================================================

  const handleAddClinic = async (e) => {

    e.preventDefault();

    if (!clinicName.trim()) {

      Swal.fire({
        title: "Missing Clinic Name",
        text: "Please enter clinic name.",
        icon: "warning",
        confirmButtonText: "OK",
      });

      return;
    }

    try {

      const token = getToken();

      const response = await fetch(
        `${API_URL}/clinics`,
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
          data.error ||
          data.message ||
          "Failed to create clinic"
        );

      }

      Swal.fire({
        title: "Clinic Added",
        text: "Clinic created successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setClinicName("");
      setClinicQuota(100);

      loadDashboard();

    } catch (error) {

      console.error(
        "Add Clinic Error:",
        error
      );

      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });

    }

  };

  // =========================================================
  // Create Data Entry Employee
  // =========================================================

  const handleCreateEmployee = async (e) => {

    e.preventDefault();

    if (
      !employeeUsername.trim() ||
      !employeePassword.trim()
    ) {

      Swal.fire({
        title: "Missing Data",
        text: "Username and password are required.",
        icon: "warning",
        confirmButtonText: "OK",
      });

      return;
    }

    try {

      const token = getToken();

      const response = await fetch(
        `${API_URL}/employees`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: employeeUsername,
            password: employeePassword,
            role: "DataEntry",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.error ||
          data.message ||
          "Failed to create employee"
        );

      }

      Swal.fire({
        title: "Employee Created",
        text: "Data Entry employee created successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setEmployeeUsername("");
      setEmployeePassword("");

      loadDashboard();

    } catch (error) {

      console.error(
        "Create Employee Error:",
        error
      );

      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });

    }

  };

  // =========================================================
  // Logout
  // =========================================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";

  };

  // =========================================================
  // Format Date
  // =========================================================

  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-GB"
    );

  };

  // =========================================================
  // Render
  // =========================================================

  return (

    <div
      className="admin-page"
      dir="ltr"
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="admin-header">

        <div>

          <h2>
            Admin Dashboard
          </h2>

          <p>
            NCI Queue Management System
          </p>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>

      {/* =====================================================
          MAIN LAYOUT
      ====================================================== */}

      <div className="admin-layout">

        {/* ===================================================
            SIDEBAR
        ==================================================== */}

        <aside className="admin-sidebar">

          <button
            className={
              activeSection === "overview"
                ? "menu-btn active"
                : "menu-btn"
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
                ? "menu-btn active"
                : "menu-btn"
            }
            onClick={() =>
              setActiveSection("clinics")
            }
          >
            Clinics
          </button>

          <button
            className={
              activeSection === "employees"
                ? "menu-btn active"
                : "menu-btn"
            }
            onClick={() =>
              setActiveSection("employees")
            }
          >
            Employees
          </button>

          <button
            className={
              activeSection === "bookings"
                ? "menu-btn active"
                : "menu-btn"
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
                ? "menu-btn active"
                : "menu-btn"
            }
            onClick={() =>
              setActiveSection("patients")
            }
          >
            Patients
          </button>

        </aside>

        {/* ===================================================
            CONTENT
        ==================================================== */}

        <main className="admin-content">

          {/* =================================================
              OVERVIEW
          ================================================== */}

          {activeSection === "overview" && (

            <>

              <div className="page-title">

                <div>

                  <h1>
                    Dashboard Overview
                  </h1>

                  <p>
                    Monitor the NCI-Q system.
                  </p>

                </div>

                <button
                  className="refresh-btn"
                  onClick={loadDashboard}
                >
                  Refresh
                </button>

              </div>

              {/* Statistics */}

              <div className="stats-grid">

                <div className="stat-card">

                  <span>
                    Total Bookings
                  </span>

                  <strong>
                    {totalBookings}
                  </strong>

                </div>

                <div className="stat-card pending">

                  <span>
                    Pending
                  </span>

                  <strong>
                    {pendingBookings}
                  </strong>

                </div>

                <div className="stat-card approved">

                  <span>
                    Approved
                  </span>

                  <strong>
                    {approvedBookings}
                  </strong>

                </div>

                <div className="stat-card rejected">

                  <span>
                    Rejected
                  </span>

                  <strong>
                    {rejectedBookings}
                  </strong>

                </div>

                <div className="stat-card">

                  <span>
                    Clinics
                  </span>

                  <strong>
                    {clinics.length}
                  </strong>

                </div>

                <div className="stat-card">

                  <span>
                    Employees
                  </span>

                  <strong>
                    {employees.length}
                  </strong>

                </div>

              </div>

              {/* Quick Actions */}

              <div className="section-title">

                <h2>
                  Quick Actions
                </h2>

              </div>

              <div className="quick-grid">

                <button
                  className="quick-card"
                  onClick={() =>
                    setActiveSection("clinics")
                  }
                >
                  <strong>
                    Manage Clinics
                  </strong>

                  <span>
                    Add and manage clinics
                  </span>
                </button>

                <button
                  className="quick-card"
                  onClick={() =>
                    setActiveSection("employees")
                  }
                >
                  <strong>
                    Manage Employees
                  </strong>

                  <span>
                    Create Data Entry accounts
                  </span>
                </button>

                <button
                  className="quick-card"
                  onClick={() =>
                    setActiveSection("bookings")
                  }
                >
                  <strong>
                    View Bookings
                  </strong>

                  <span>
                    View all booking requests
                  </span>
                </button>

                <button
                  className="quick-card"
                  onClick={() =>
                    setActiveSection("patients")
                  }
                >
                  <strong>
                    Search Patients
                  </strong>

                  <span>
                    Find patient booking history
                  </span>
                </button>

              </div>

            </>

          )}

          {/* =================================================
              CLINICS
          ================================================== */}

          {activeSection === "clinics" && (

            <>

              <div className="page-title">

                <div>

                  <h1>
                    Clinics Management
                  </h1>

                  <p>
                    Add and manage NCI clinics.
                  </p>

                </div>

              </div>

              <div className="admin-two-columns">

                {/* Add Clinic */}

                <div className="admin-box">

                  <h2>
                    Add New Clinic
                  </h2>

                  <form
                    onSubmit={handleAddClinic}
                  >

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
                      placeholder="Clinic name"
                    />

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

                    <button
                      type="submit"
                      className="primary-btn"
                    >
                      Add Clinic
                    </button>

                  </form>

                </div>

                {/* Clinics List */}

                <div className="admin-box">

                  <h2>
                    Existing Clinics
                  </h2>

                  {clinics.length === 0 ? (

                    <p className="empty-text">
                      No clinics found.
                    </p>

                  ) : (

                    <div className="simple-list">

                      {clinics.map(
                        (clinic) => (

                          <div
                            className="list-row"
                            key={clinic._id}
                          >

                            <div>

                              <strong>
                                {clinic.name}
                              </strong>

                              <span>
                                Quota:{" "}
                                {
                                  clinic.quota
                                }
                              </span>

                            </div>

                            <span
                              className={
                                clinic.isActive
                                  ? "active-label"
                                  : "inactive-label"
                              }
                            >
                              {clinic.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </div>

              </div>

            </>

          )}

          {/* =================================================
              EMPLOYEES
          ================================================== */}

          {activeSection === "employees" && (

            <>

              <div className="page-title">

                <div>

                  <h1>
                    Employee Management
                  </h1>

                  <p>
                    Create and manage Data Entry accounts.
                  </p>

                </div>

              </div>

              <div className="admin-two-columns">

                {/* Create Employee */}

                <div className="admin-box">

                  <h2>
                    Create Data Entry
                  </h2>

                  <form
                    onSubmit={
                      handleCreateEmployee
                    }
                  >

                    <label>
                      Username
                    </label>

                    <input
                      type="text"
                      value={
                        employeeUsername
                      }
                      onChange={(e) =>
                        setEmployeeUsername(
                          e.target.value
                        )
                      }
                      placeholder="Username"
                    />

                    <label>
                      Password
                    </label>

                    <input
                      type="password"
                      value={
                        employeePassword
                      }
                      onChange={(e) =>
                        setEmployeePassword(
                          e.target.value
                        )
                      }
                      placeholder="Password"
                    />

                    <button
                      type="submit"
                      className="primary-btn"
                    >
                      Create Employee
                    </button>

                  </form>

                </div>

                {/* Employees */}

                <div className="admin-box">

                  <h2>
                    Employees
                  </h2>

                  {employees.length === 0 ? (

                    <p className="empty-text">
                      No employees found.
                    </p>

                  ) : (

                    <div className="simple-list">

                      {employees.map(
                        (employee) => (

                          <div
                            className="list-row"
                            key={employee._id}
                          >

                            <div>

                              <strong>
                                {
                                  employee.username
                                }
                              </strong>

                              <span>
                                Role:{" "}
                                {
                                  employee.role
                                }
                              </span>

                            </div>

                            <span
                              className={
                                employee.isActive !==
                                  false
                                  ? "active-label"
                                  : "inactive-label"
                              }
                            >
                              {employee.isActive !==
                              false
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </div>

              </div>

            </>

          )}

          {/* =================================================
              BOOKINGS
          ================================================== */}

          {activeSection === "bookings" && (

            <>

              <div className="page-title">

                <div>

                  <h1>
                    All Bookings
                  </h1>

                  <p>
                    View all booking requests.
                  </p>

                </div>

              </div>

              {loading ? (

                <div className="admin-box">
                  Loading bookings...
                </div>

              ) : bookings.length === 0 ? (

                <div className="admin-box">
                  No bookings found.
                </div>

              ) : (

                <div className="booking-table">

                  <div className="table-header">

                    <span>
                      Patient
                    </span>

                    <span>
                      National ID
                    </span>

                    <span>
                      Clinic
                    </span>

                    <span>
                      Status
                    </span>

                    <span>
                      Queue
                    </span>

                    <span>
                      Date
                    </span>

                  </div>

                  {bookings.map(
                    (booking) => (

                      <div
                        className="table-row"
                        key={booking._id}
                      >

                        <span>
                          {
                            booking.patientName
                          }
                        </span>

                        <span>
                          {
                            booking.nationalId
                          }
                        </span>

                        <span>
                          {
                            booking.clinicId?.name ||
                            "Unknown"
                          }
                        </span>

                        <span>
                          <b
                            className={
                              `status ${booking.status}`
                            }
                          >
                            {
                              booking.status
                            }
                          </b>
                        </span>

                        <span>
                          {
                            booking.queueNumber ||
                            "-"
                          }
                        </span>

                        <span>
                          {
                            formatDate(
                              booking.bookingDate
                            )
                          }
                        </span>

                      </div>

                    )
                  )}

                </div>

              )}

            </>

          )}

          {/* =================================================
              PATIENTS
          ================================================== */}

          {activeSection === "patients" && (

            <>

              <div className="page-title">

                <div>

                  <h1>
                    Patient Search
                  </h1>

                  <p>
                    Search patient booking history using National ID.
                  </p>

                </div>

              </div>

              <div className="search-box">

                <input
                  type="text"
                  value={
                    searchNationalId
                  }
                  onChange={(e) =>
                    setSearchNationalId(
                      e.target.value
                    )
                  }
                  placeholder="Enter 14 digit National ID"
                />

                <button
                  className="primary-btn"
                  onClick={searchPatient}
                >
                  Search
                </button>

              </div>

              {patientBookings.length >
                0 && (

                <div className="patient-results">

                  <h2>
                    Booking History
                  </h2>

                  <div className="booking-grid">

                    {patientBookings.map(
                      (booking) => (

                        <div
                          className="patient-card"
                          key={booking._id}
                        >

                          <h3>
                            {
                              booking.patientName
                            }
                          </h3>

                          <p>
                            <strong>
                              Clinic:
                            </strong>{" "}
                            {
                              booking.clinicId
                                ?.name ||
                              "Unknown"
                            }
                          </p>

                          <p>
                            <strong>
                              Status:
                            </strong>{" "}
                            {
                              booking.status
                            }
                          </p>

                          <p>
                            <strong>
                              Queue:
                            </strong>{" "}
                            {
                              booking.queueNumber ||
                              "-"
                            }
                          </p>

                          <p>
                            <strong>
                              Date:
                            </strong>{" "}
                            {
                              formatDate(
                                booking.bookingDate
                              )
                            }
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

            </>

          )}

        </main>

      </div>

      {/* =====================================================
          CSS
      ====================================================== */}

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

        /* Header */

        .admin-header {
          background: #0c2340;
          color: white;
          padding: 18px 35px;

          display: flex;
          justify-content: space-between;
          align-items: center;

          box-shadow:
            0 2px 10px
            rgba(0,0,0,0.08);
        }

        .admin-header h2 {
          margin: 0;
          font-size: 21px;
        }

        .admin-header p {
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

        .logout-btn:hover {
          background: #e2e8f0;
        }

        /* Layout */

        .admin-layout {
          display: flex;
          min-height: calc(100vh - 75px);
        }

        /* Sidebar */

        .admin-sidebar {
          width: 220px;
          background: white;

          border-right:
            1px solid #e2e8f0;

          padding: 25px 15px;
        }

        .menu-btn {
          width: 100%;

          border: none;
          background: transparent;

          text-align: left;

          padding: 12px 15px;

          margin-bottom: 7px;

          border-radius: 7px;

          cursor: pointer;

          color: #475569;

          font-size: 14px;
        }

        .menu-btn:hover {
          background: #f1f5f9;
        }

        .menu-btn.active {
          background: #e8eef7;
          color: #0c2340;
          font-weight: bold;
        }

        /* Content */

        .admin-content {
          flex: 1;
          padding: 35px;

          max-width: 1400px;
        }

        /* Page Title */

        .page-title {
          display: flex;

          justify-content:
            space-between;

          align-items: center;

          margin-bottom: 30px;
        }

        .page-title h1 {
          margin: 0;

          color: #0f172a;

          font-size: 27px;
        }

        .page-title p {
          margin-top: 7px;

          color: #64748b;
        }

        .refresh-btn {
          border: 1px solid #cbd5e1;

          background: white;

          padding: 9px 15px;

          border-radius: 7px;

          cursor: pointer;
        }

        /* Statistics */

        .stats-grid {
          display: grid;

          grid-template-columns:
            repeat(
              auto-fit,
              minmax(180px, 1fr)
            );

          gap: 18px;

          margin-bottom: 35px;
        }

        .stat-card {
          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 11px;

          padding: 22px;

          box-shadow:
            0 3px 10px
            rgba(15,23,42,0.04);
        }

        .stat-card span {
          display: block;

          color: #64748b;

          font-size: 13px;

          margin-bottom: 10px;
        }

        .stat-card strong {
          font-size: 30px;

          color: #0c2340;
        }

        .stat-card.pending strong {
          color: #d97706;
        }

        .stat-card.approved strong {
          color: #16a34a;
        }

        .stat-card.rejected strong {
          color: #dc2626;
        }

        /* Quick Actions */

        .section-title {
          margin-bottom: 15px;
        }

        .section-title h2 {
          color: #0f172a;
        }

        .quick-grid {
          display: grid;

          grid-template-columns:
            repeat(
              auto-fit,
              minmax(220px, 1fr)
            );

          gap: 18px;
        }

        .quick-card {
          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 11px;

          padding: 22px;

          text-align: left;

          cursor: pointer;

          transition: 0.2s;
        }

        .quick-card:hover {
          transform: translateY(-2px);

          box-shadow:
            0 7px 18px
            rgba(15,23,42,0.08);
        }

        .quick-card strong {
          display: block;

          color: #0c2340;

          margin-bottom: 7px;
        }

        .quick-card span {
          color: #64748b;

          font-size: 13px;
        }

        /* Two Columns */

        .admin-two-columns {
          display: grid;

          grid-template-columns:
            minmax(300px, 400px)
            1fr;

          gap: 20px;
        }

        /* Box */

        .admin-box {
          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 11px;

          padding: 22px;

          margin-bottom: 20px;
        }

        .admin-box h2 {
          margin-top: 0;

          color: #0c2340;

          font-size: 18px;
        }

        .admin-box form {
          display: flex;

          flex-direction: column;

          gap: 9px;
        }

        .admin-box label {
          color: #475569;

          font-size: 13px;

          margin-top: 8px;
        }

        .admin-box input,
        .search-box input {
          padding: 11px;

          border:
            1px solid #cbd5e1;

          border-radius: 7px;

          outline: none;
        }

        .admin-box input:focus,
        .search-box input:focus {
          border-color: #0c2340;
        }

        .primary-btn {
          border: none;

          background: #0c2340;

          color: white;

          padding: 11px 18px;

          border-radius: 7px;

          cursor: pointer;

          font-weight: bold;

          margin-top: 10px;
        }

        .primary-btn:hover {
          background: #16385f;
        }

        /* Lists */

        .simple-list {
          display: flex;

          flex-direction: column;
        }

        .list-row {
          display: flex;

          justify-content:
            space-between;

          align-items: center;

          padding: 14px 0;

          border-bottom:
            1px solid #e2e8f0;
        }

        .list-row:last-child {
          border-bottom: none;
        }

        .list-row strong {
          display: block;

          color: #334155;

          margin-bottom: 4px;
        }

        .list-row span {
          color: #64748b;

          font-size: 12px;
        }

        .active-label {
          color: #15803d !important;

          font-weight: bold;
        }

        .inactive-label {
          color: #dc2626 !important;

          font-weight: bold;
        }

        .empty-text {
          color: #64748b;
        }

        /* Booking Table */

        .booking-table {
          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 11px;

          overflow: hidden;
        }

        .table-header,
        .table-row {
          display: grid;

          grid-template-columns:
            1.3fr
            1.2fr
            1fr
            .8fr
            .6fr
            .9fr;

          gap: 15px;

          padding: 15px 18px;

          align-items: center;
        }

        .table-header {
          background: #f8fafc;

          color: #64748b;

          font-size: 12px;

          font-weight: bold;
        }

        .table-row {
          border-top:
            1px solid #e2e8f0;

          font-size: 13px;

          color: #334155;
        }

        .status {
          padding: 5px 8px;

          border-radius: 15px;

          font-size: 11px;
        }

        .status.pending {
          background: #fef3c7;

          color: #b45309;
        }

        .status.approved {
          background: #dcfce7;

          color: #15803d;
        }

        .status.rejected {
          background: #fee2e2;

          color: #b91c1c;
        }

        /* Search */

        .search-box {
          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 11px;

          padding: 20px;

          display: flex;

          gap: 10px;

          max-width: 700px;

          margin-bottom: 25px;
        }

        .search-box input {
          flex: 1;
        }

        /* Patient Cards */

        .booking-grid {
          display: grid;

          grid-template-columns:
            repeat(
              auto-fit,
              minmax(280px, 1fr)
            );

          gap: 18px;
        }

        .patient-card {
          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 10px;

          padding: 20px;
        }

        .patient-card h3 {
          margin-top: 0;

          color: #0c2340;
        }

        .patient-card p {
          color: #475569;

          font-size: 13px;
        }

        /* Mobile */

        @media (max-width: 800px) {

          .admin-layout {
            flex-direction: column;
          }

          .admin-sidebar {
            width: 100%;

            display: flex;

            overflow-x: auto;

            padding: 10px;
          }

          .menu-btn {
            min-width: 120px;

            margin-right: 5px;

            margin-bottom: 0;
          }

          .admin-content {
            padding: 20px;
          }

          .admin-two-columns {
            grid-template-columns: 1fr;
          }

          .table-header,
          .table-row {
            grid-template-columns:
              1fr
              1fr
              1fr;
          }

          .table-header span:nth-child(n+4),
          .table-row span:nth-child(n+4) {
            display: none;
          }

        }

      `}</style>

    </div>
  );
};

export default AdminDashboard;

