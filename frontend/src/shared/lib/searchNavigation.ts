export type SearchNavParams = {
  from: string;
  to: string;
  depart: string;
  tripType: "oneWay" | "roundTrip";
  travellers: number;
};

export function buildFlightsUrl({
  from,
  to,
  depart,
  tripType,
  travellers,
}: SearchNavParams) {
  const params = new URLSearchParams({
    from,
    to,
    date: depart,
    tripType,
    passengers: String(travellers),
  });

  return `/flights?${params.toString()}`;
}