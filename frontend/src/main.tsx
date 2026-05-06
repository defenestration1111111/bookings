
import "./shared/lib/i18n";
import { createRoot } from "react-dom/client";
import { BookingProvider } from "./entities/booking/model/BookingContext";
import "./styles.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <BookingProvider>
      <App />
    </BookingProvider>
  </BrowserRouter>
);