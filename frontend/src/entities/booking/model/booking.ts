import type { components } from "../../../shared/api/schema";
import { PassengerInfo } from "../../passenger/model/passenger";

export type BookingRequest = components["schemas"]["BookingRequest"];
export type BookingResponse = components["schemas"]["BookingResponse"];
export type BookingLegRequest = components["schemas"]["BookingLegRequest"];
export type MockPayment = components["schemas"]["MockPayment"];

export type BookingFormValues = {
  passengers: PassengerInfo[];
  cardNumber: string;
  expiration: string;
  cvv: string;
};
