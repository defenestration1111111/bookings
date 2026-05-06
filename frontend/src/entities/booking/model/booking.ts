import { PassengerInfo } from "../../passenger/model/passenger";

export type BookingDetails = {
  flightId: number;
  passengers: PassengerInfo[];
  selectedSeatIds: string[];
};

export type ConfirmationData = {
  bookingId: string;
  status: "confirmed" | "pending" | "failed";
  gate: string;
  boardingTime: string;
};

export type BookingFormValues = {
  passengers: PassengerInfo[];
  cardNumber: string;
  expiration: string;
  cvv: string;
};
