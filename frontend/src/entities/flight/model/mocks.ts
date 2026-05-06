import { FlightLeg, FlightOption } from "./flight";

export type MockFlightLeg = FlightLeg & {
  departDate: string;
  direction: "outbound" | "inbound";
};

export type MockFlightOption = Omit<FlightOption, "legs"> & {
  legs: MockFlightLeg[];
};