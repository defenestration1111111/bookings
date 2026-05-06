export type SeatClass = "Business" | "Comfort" | "Economy";

export type Seat = {
  id: string;           // "11D", "2A" и т.д.
  row: number;
  letter: string;
  seatClass: SeatClass;
  unavailable?: boolean;
  price: number;
};

// Тип для цен по классу — Record<ключ, значение>
export type SeatPrices = Record<SeatClass, number>;

// types.ts — добавить

export type SeatLayout = {
  columns: string[];        // ["A","B","C","D","E","F"]
  aisles_after: string[];   // ["C"] — после каких колонок рисовать проход
};

export type SeatMapResponse = {
  airplane: { code: string; model: string };
  layout: SeatLayout;
  seats: Seat[];
};