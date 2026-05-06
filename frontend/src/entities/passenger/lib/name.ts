import { PassengerInfo } from "../model/passenger";

export function getInitials(passenger: PassengerInfo): string {
  return `${passenger.firstName[0] ?? ""}${passenger.lastName[0] ?? ""}`.toUpperCase();
}
