import { getAirports } from "../../../entities/airport/api/airport.api";
import { Airport } from "../../../entities/airport/model/airport";
import { useFetch } from "../../../shared/api/useFetch";

type UseAirportsResult = {
  airports: Airport[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useAirports(): UseAirportsResult {
  const { data, loading, error, refetch } = useFetch(
    (signal) => getAirports(signal),
    [] // fetch once on mount
  );

  return {
    airports: data ?? [],
    loading,
    error,
    refetch,
  };
}