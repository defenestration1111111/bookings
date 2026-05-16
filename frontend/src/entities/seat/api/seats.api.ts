import { fetchJson } from "../../../shared/api/client";
import { Seat, SeatMapResponse } from "../model/seat";

const mockSeats: Seat[] = [
  { id: "1A", row: 1, letter: "A", seatClass: "Business", price: 140 },
  { id: "1B", row: 1, letter: "B", seatClass: "Business", price: 140 },
  { id: "2E", row: 2, letter: "E", seatClass: "Business", unavailable: true, price: 140 },
  { id: "11D", row: 11, letter: "D", seatClass: "Comfort", price: 55 },
  // ... остальные места
];

const mockSeatMap: SeatMapResponse = {
  airplane: { code: "32N", model: "Aerobus A320neo" },
  layout: {
    columns: ["A", "B", "C", "D", "E", "F"],
    aisles_after: ["C"],
  },
  seats: [
    { id: "1A", row: 1, letter: "A", seatClass: "Business", price: 140 },
    { id: "1B", row: 1, letter: "B", seatClass: "Business", price: 140 },
    { id: "1C", row: 1, letter: "C", seatClass: "Business", price: 140 },
    { id: "1D", row: 1, letter: "D", seatClass: "Business", price: 140 },
    { id: "1E", row: 1, letter: "E", seatClass: "Business", price: 140 },
    { id: "1F", row: 1, letter: "F", seatClass: "Business", price: 140 },
    { id: "2A", row: 2, letter: "A", seatClass: "Business", price: 140 },
    { id: "2B", row: 2, letter: "B", seatClass: "Business", price: 140 },
    { id: "2C", row: 2, letter: "C", seatClass: "Business", price: 140 },
    { id: "2D", row: 2, letter: "D", seatClass: "Business", price: 140 },
    { id: "2E", row: 2, letter: "E", seatClass: "Business", unavailable: true, price: 140 },
    { id: "2F", row: 2, letter: "F", seatClass: "Business", price: 140 },
    { id: "10A", row: 10, letter: "A", seatClass: "Economy", price: 25 },
    { id: "10B", row: 10, letter: "B", seatClass: "Economy", price: 25 },
    { id: "10C", row: 10, letter: "C", seatClass: "Economy", unavailable: true, price: 25 },
    { id: "10D", row: 10, letter: "D", seatClass: "Economy", price: 25 },
    { id: "10E", row: 10, letter: "E", seatClass: "Economy", price: 25 },
    { id: "10F", row: 10, letter: "F", seatClass: "Economy", price: 25 },
    // ... остальные
  ],
};

// Получить карту мест для конкретного рейса
// flightId пока не используется, но подпись функции уже правильная —
// бэкенд будет возвращать места именно по рейсу
// export async function getSeatMap(flightId: number): Promise<SeatMapResponse> {
//   return fetchJson<SeatMapResponse>(`/flights/${flightId}/seats`);
// }

export async function getSeatMap(
  flightId: string,
  signal?: AbortSignal
): Promise<SeatMapResponse> {
  return fetchJson<SeatMapResponse>(`/flights/${flightId}/seats`, { signal });
}