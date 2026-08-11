
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../assets/mciLogo.png";
// import Swal from "sweetalert2";

// const Login = () => {
//   const navigate = useNavigate();

//   const [isLoading, setIsLoading] = useState(false);

//   // ============================================================
//   // Handle Login
//   // ============================================================
//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const username = e.target.username.value.trim();
//     const password = e.target.password.value;

//     // ============================================================
//     // Prevent duplicate requests
//     // ============================================================
//     if (isLoading) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // ========================================================
//       // Login API
//       // Backend:
//       // POST /api/auth/login
//       // ========================================================
//       const response = await fetch(
//         "http://localhost:8000/api/auth/login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             username,
//             password,
//           }),
//         }
//       );

//       const result = await response.json();

//       // ========================================================
//       // Login Failed
//       // ========================================================
//       if (!response.ok) {
//         throw new Error(
//           result.error ||
//             "Username or password is incorrect"
//         );
//       }

//       // ========================================================
//       // Validate Backend Response
//       // ========================================================
//       if (
//         !result.success ||
//         !result.data ||
//         !result.data.token ||
//         !result.data.role
//       ) {
//         throw new Error(
//           "Invalid login response from server"
//         );
//       }

//       const {
//         token,
//         role,
//         username: loggedInUsername,
//       } = result.data;

//       // ========================================================
//       // Save Authentication Data
//       // ========================================================
//       localStorage.setItem("token", token);
//       localStorage.setItem("role", role);
//       localStorage.setItem(
//         "username",
//         loggedInUsername
//       );

//       // ========================================================
//       // Success Message
//       // ========================================================
//       await Swal.fire({
//         title: "Welcome " + loggedInUsername,
//         text: "login successful",
//         icon: "success",
//         timer: 1200,
//         showConfirmButton: false,
//         background: "#ffffff",
//       });

//       // ========================================================
//       // Redirect According To Role
//       // ========================================================
//       if (role === "admin") {
//         navigate("/admin", {
//           replace: true,
//         });

//         return;
//       }

//       if (role === "DataEntry") {
//         navigate("/DataEntryDashboard", {
//           replace: true,
//         });

//         return;
//       }

//       // ========================================================
//       // Unknown Role
//       // ========================================================
//       localStorage.removeItem("token");
//       localStorage.removeItem("role");
//       localStorage.removeItem("username");

//       throw new Error(
//         "Your account does not have a valid role."
//       );

//     } catch (error) {
//       console.error("Login Error:", error);

//       Swal.fire({
//         title: "Login Failed",
//         text:
//           error.message ||
//           "Failed to login.",
//         icon: "error",
//         confirmButtonText: "Try Again",
//         confirmButtonColor: "#0c2340",
//       });

//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ============================================================
//   // UI
//   // ============================================================
//   return (
//     <div
//       dir="rtl"
//       className="main-content"
//     >
//       <div className="login-card">

//         {/* Logo */}
//         <img
//           src={logo}
//           alt="Logo"
//           style={{
//             width: "70px",
//             marginBottom: "15px",
//           }}
//         />

//         {/* Title */}
//         <h2 className="card-title">
//           بوابة موظف المستشفى
//         </h2>

//         <p className="card-subtitle">
//           تسجيل الدخول لإدارة نظام قوائم الانتظار
//         </p>

//         {/* Login Form */}
//         <form onSubmit={handleLogin}>

//           {/* Username */}
//           <div className="form-group">
//             <label htmlFor="username">
//               اسم المستخدم
//             </label>

//             <input
//               id="username"
//               type="text"
//               name="username"
//               className="form-control"
//               required
//               autoComplete="username"
//               placeholder="اسم المستخدم"
//               disabled={isLoading}
//             />
//           </div>

//           {/* Password */}
//           <div className="form-group">
//             <label htmlFor="password">
//               كلمة المرور
//             </label>

//             <input
//               id="password"
//               type="password"
//               name="password"
//               className="form-control"
//               required
//               autoComplete="current-password"
//               placeholder="••••••••"
//               disabled={isLoading}
//             />
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="submit-btn"
//             disabled={isLoading}
//           >
//             {isLoading
//               ? "جاري تسجيل الدخول..."
//               : "دخول"}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../assets/mciLogo.png";
// import Swal from "sweetalert2";

// const Login = () => {
//   const navigate = useNavigate();

//   // =========================
//   // UI State
//   // =========================
//   const [isLoading, setIsLoading] = useState(false);

//   // =========================
//   // Handle Login
//   // =========================
//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const username = e.target.username.value.trim();
//     const password = e.target.password.value;

//     if (!username || !password) {
//       Swal.fire({
//         title: "بيانات ناقصة",
//         text: "برجاء إدخال اسم المستخدم وكلمة المرور.",
//         icon: "warning",
//         confirmButtonText: "حسناً",
//         confirmButtonColor: "#d97706",
//       });

//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch(
//         "http://localhost:8000/api/auth/login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             username,
//             password,
//           }),
//         }
//       );

//       const result = await response.json();

//       // =========================
//       // Login Failed
//       // =========================
//       if (!response.ok) {
//         Swal.fire({
//           title: "خطأ في تسجيل الدخول",
//           text:
//             result.error ||
//             "اسم المستخدم أو كلمة المرور غير صحيحة.",
//           icon: "error",
//           confirmButtonText: "إعادة المحاولة",
//           confirmButtonColor: "#0c2340",
//         });

//         return;
//       }

//       // =========================
//       // Get Authentication Data
//       // =========================
//       const token = result.token;
//       const role = result.data?.role;

//       if (!token || !role) {
//         Swal.fire({
//           title: "خطأ في تسجيل الدخول",
//           text: "استجابة تسجيل الدخول غير صالحة.",
//           icon: "error",
//           confirmButtonText: "حسناً",
//           confirmButtonColor: "#dc2626",
//         });

//         return;
//       }

//       // =========================
//       // Save Authentication Data
//       // =========================
//       localStorage.setItem("authToken", token);
//       localStorage.setItem("userRole", role);
//       localStorage.setItem(
//         "username",
//         result.data?.username || username
//       );

//       // =========================
//       // Success Message
//       // =========================
//       await Swal.fire({
//         title: "أهلاً بك",
//         text: "تم تسجيل الدخول بنجاح.",
//         icon: "success",
//         timer: 1200,
//         showConfirmButton: false,
//         background: "#ffffff",
//       });

//       // =========================
//       // Redirect According To Role
//       // =========================
//       if (role === "admin") {
//         navigate("/admin");
//       } else if (role === "data_entry") {
//         navigate("/DataEntryDashboard");
//       } else {
//         // Unknown role
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("userRole");
//         localStorage.removeItem("username");

//         Swal.fire({
//           title: "صلاحية غير معروفة",
//           text: "لا يمكن تحديد لوحة التحكم الخاصة بهذا المستخدم.",
//           icon: "error",
//           confirmButtonText: "حسناً",
//           confirmButtonColor: "#dc2626",
//         });
//       }
//     } catch (error) {
//       console.error("Login Error:", error);

//       Swal.fire({
//         title: "خطأ في الاتصال",
//         text: "تعذر الاتصال بالسيرفر. برجاء المحاولة مرة أخرى.",
//         icon: "warning",
//         confirmButtonText: "حاول مجدداً",
//         confirmButtonColor: "#d97706",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // =========================
//   // UI
//   // =========================
//   return (
//     <div dir="rtl" className="main-content">
//       <div className="login-card">

//         <img
//           src={logo}
//           alt="Logo"
//           style={{
//             width: "70px",
//             marginBottom: "15px",
//           }}
//         />

//         <h2 className="card-title">
//           بوابة موظفي المستشفى
//         </h2>

//         <p className="card-subtitle">
//           تسجيل الدخول للوصول إلى لوحة التحكم
//         </p>

//         <form onSubmit={handleLogin}>

//           {/* Username */}
//           <div className="form-group">
//             <label htmlFor="username">
//               اسم المستخدم
//             </label>

//             <input
//               id="username"
//               type="text"
//               name="username"
//               className="form-control"
//               placeholder="Username"
//               autoComplete="username"
//               disabled={isLoading}
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className="form-group">
//             <label htmlFor="password">
//               كلمة المرور
//             </label>

//             <input
//               id="password"
//               type="password"
//               name="password"
//               className="form-control"
//               placeholder="••••••••"
//               autoComplete="current-password"
//               disabled={isLoading}
//               required
//             />
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="submit-btn"
//             disabled={isLoading}
//           >
//             {isLoading
//               ? "جاري تسجيل الدخول..."
//               : "دخول"}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import logo from "../assets/mciLogo.png";

// const Login = () => {
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const username = e.target.username.value;
//     const password = e.target.password.value;

//     try {
//       const response = await fetch("http://localhost:8000/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username,
//           password,
//         }),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         Swal.fire({
//           title: "خطأ في الدخول",
//           text: result.error || "اسم المستخدم أو كلمة المرور غير صحيحة",
//           icon: "error",
//           confirmButtonText: "حاول مرة أخرى",
//           confirmButtonColor: "#0c2340",
//         });

//         return;
//       }

// // Get token and role from backend
// const token = result.data?.token;
// const role = result.data?.role;

// console.log("TOKEN FROM LOGIN:", token);
// console.log("ROLE FROM LOGIN:", role);

// if (!token) {
//   console.log("Login response:", result);

//   Swal.fire({
//     title: "Login Error",
//     text: "Server did not return a valid token.",
//     icon: "error",
//   });

//   return;
// }

// // Save token
// localStorage.setItem("token", token);


//       // Get role from backend
//     //   const role = result.data?.role;

//       Swal.fire({
//         title: "أهلاً بك",
//         text: "تم تسجيل الدخول بنجاح",
//         icon: "success",
//         timer: 1200,
//         showConfirmButton: false,
//       });

//       // Redirect based on role
//       setTimeout(() => {
//         if (role === "admin") {
//           navigate("/admin");
//         } else if (role === "DataEntry") {
//           navigate("/data-entry");
//         } else {
//           Swal.fire({
//             title: "خطأ",
//             text: "نوع المستخدم غير معروف",
//             icon: "error",
//           });
//         }
//       }, 1200);
//     } catch (error) {
//       console.error("Login Error:", error);

//       Swal.fire({
//         title: "خطأ في الاتصال",
//         text: "تعذر الاتصال بالسيرفر",
//         icon: "warning",
//         confirmButtonText: "حاول مرة أخرى",
//         confirmButtonColor: "#d97706",
//       });
//     }
//   };

//   return (
//     <div dir="rtl" className="main-content">
//       <div className="login-card">
//         <img
//           src={logo}
//           alt="Logo"
//           style={{
//             width: "70px",
//             marginBottom: "15px",
//           }}
//         />

//         <h2 className="card-title">
//           بوابة موظف المستشفى
//         </h2>

//         <p className="card-subtitle">
//           تسجيل الدخول لإدارة قوائم الانتظار اليومية
//         </p>

//         <form onSubmit={handleLogin}>
//           <div className="form-group">
//             <label htmlFor="username">
//               اسم المستخدم
//             </label>

//             <input
//               type="text"
//               id="username"
//               name="username"
//               className="form-control"
//               placeholder="Username"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">
//               كلمة المرور
//             </label>

//             <input
//               type="password"
//               id="password"
//               name="password"
//               className="form-control"
//               placeholder="Password"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="submit-btn"
//           >
//             تسجيل الدخول
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;



import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/mciLogo.png";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = await response.json();

      // =========================
      // Login Failed
      // =========================
      if (!response.ok) {
        Swal.fire({
          title: "خطأ في الدخول",
          text:
            result.error ||
            "اسم المستخدم أو كلمة المرور غير صحيحة",
          icon: "error",
          confirmButtonText: "حاول مرة أخرى",
          confirmButtonColor: "#0c2340",
        });

        return;
      }

      // =========================
      // Get Token & Role
      // =========================
      const token = result.data?.token;
      const role = result.data?.role;

      console.log("Login response:", result);
      console.log("TOKEN FROM LOGIN:", token);
      console.log("ROLE FROM LOGIN:", role);

      // =========================
      // Token Validation
      // =========================
      if (!token) {
        Swal.fire({
          title: "Login Error",
          text: "Server did not return a valid token.",
          icon: "error",
          confirmButtonText: "حاول مرة أخرى",
        });

        return;
      }

      // =========================
      // Save Token
      // =========================
      localStorage.setItem("token", token);

      // =========================
      // Login Success
      // =========================
      Swal.fire({
        title: "أهلاً بك",
        text: "تم تسجيل الدخول بنجاح",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });

      // =========================
      // Redirect Based On Role
      // =========================
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "DataEntry") {
          navigate("/data-entry");
        } else {
          Swal.fire({
            title: "خطأ",
            text: "نوع المستخدم غير معروف",
            icon: "error",
            confirmButtonText: "حسنًا",
          });
        }
      }, 1200);
    } catch (error) {
      console.error("Login Error:", error);

      Swal.fire({
        title: "خطأ في الاتصال",
        text: "تعذر الاتصال بالسيرفر",
        icon: "warning",
        confirmButtonText: "حاول مرة أخرى",
        confirmButtonColor: "#d97706",
      });
    }
  };

  return (
    <div dir="rtl" className="main-content">
      <div className="login-card">

        <img
          src={logo}
          alt="Logo"
          style={{
            width: "70px",
            marginBottom: "15px",
          }}
        />

        <h2 className="card-title">
          بوابة موظف المستشفى
        </h2>

        <p className="card-subtitle">
          تسجيل الدخول لإدارة قوائم الانتظار اليومية
        </p>

        <form onSubmit={handleLogin}>

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">
              اسم المستخدم
            </label>

            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              placeholder="Username"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              كلمة المرور
            </label>

            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Password"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="submit-btn"
          >
            تسجيل الدخول
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;


