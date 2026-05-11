import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./app/layout/Header";
import Footer from "./app/layout/Footer";
import { BookingPage, ConfirmationPage, ResultsPage, SearchPage } from "./pages";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/flights" element={<ResultsPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}
