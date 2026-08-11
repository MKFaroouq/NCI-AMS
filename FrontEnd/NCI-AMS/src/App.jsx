import { BrowserRouter, Routes, Route } from "react-router-dom";

import BookingForm from "./pages/BookingForm";
import Login from "./pages/Login";
import DataEntryDashboard from "./pages/DataEntryDashboard";
import AdminDashboard from "./pages/adminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<BookingForm />} />

        <Route path="/login" element={<Login />} />

        <Route path="/data-entry" element={<DataEntryDashboard />} />

        <Route path="/admin" element={<AdminDashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;