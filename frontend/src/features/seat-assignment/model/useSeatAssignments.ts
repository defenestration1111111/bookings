import { useState } from "react";
import { Seat } from "../../../entities/seat/model/seat";


export function useSeatAssignments(totalLegs: number) {
  const [assignmentsByLeg, setAssignmentsByLeg] = useState<Map<string, number>[]>(
    () => Array.from({ length: totalLegs }, () => new Map())
  );

  function assign(legIndex: number, seat: Seat, passengerIdx: number) {
    setAssignmentsByLeg(prev => {
      const next = prev.map(m => new Map(m));
      const map = next[legIndex];
      for (const [seatId, idx] of map.entries()) {
        if (idx === passengerIdx) map.delete(seatId);
      }
      map.delete(seat.id);
      map.set(seat.id, passengerIdx);
      return next;
    });
  }

  function getAssignments(legIndex: number): Map<string, number> {
    return assignmentsByLeg[legIndex];
  }

  function getSeatIdsForLeg(legIndex: number): string[] {
    return [...assignmentsByLeg[legIndex].keys()];
  }

  return { assign, getAssignments, getSeatIdsForLeg };
}