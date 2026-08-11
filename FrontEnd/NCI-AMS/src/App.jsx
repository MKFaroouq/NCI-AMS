import { BrowserRouter, Routes, Route } from "react-router-dom";

import BookingForm from "./pages/BookingForm";
import Login from "./pages/Login";
import DataEntryDashboard from "./pages/DataEntryDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<BookingForm />} />

        <Route path="/login" element={<Login />} />

        <Route path="/data-entry" element={<DataEntryDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;