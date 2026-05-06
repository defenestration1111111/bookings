import { Seat } from "../model/seat";

type SeatButtonProps = {
  seat: Seat;
  selected: boolean;
  assignedInitials?: string;
  onToggle: (seat: Seat) => void;
};

export default function SeatButton({ seat, selected, assignedInitials, onToggle }: SeatButtonProps) {
  const isBusiness = seat.seatClass === "Business";
  const isComfort   = seat.seatClass === "Comfort";

  const sizeClass = isBusiness
    ? "w-14 h-16 rounded-xl"
    : isComfort
    ? "w-11 h-12 rounded-lg"
    : "w-11 h-11 rounded-lg";

  const textClass = "font-caption text-caption text-[12px]";

  if (seat.unavailable) {
    return (
      <button
        type="button"
        disabled
        aria-label={`${seat.id} unavailable`}
        className={`${sizeClass} border border-hairline bg-surface-soft opacity-60 flex items-center justify-center cursor-not-allowed`}
      >
        {isBusiness && (
          <span className="material-symbols-outlined text-[18px] text-muted">close</span>
        )}
      </button>
    );
  }

  if (selected) {
    return (
      <button
        type="button"
        aria-label={`${seat.id} selected`}
        onClick={() => onToggle(seat)}
        className={`${sizeClass} bg-rausch text-on-primary shadow-md flex items-center justify-center transition-all relative`}
      >
        {assignedInitials ? (
          <span className="text-[11px] font-bold tracking-wide">{assignedInitials}</span>
        ) : (
          <span className="material-symbols-outlined text-[18px]">check</span>
        )}
      </button>
    );
  }

  const comfortClass = isComfort
    ? "border-legal-blue/30 bg-[#f0f7ff] hover:border-legal-blue"
    : "border-hairline bg-canvas hover:border-ink";

  const businessShadow = isBusiness ? "shadow-sm hover:shadow-md flex-col" : "";

  return (
    <button
      type="button"
      aria-label={`Select seat ${seat.id}`}
      onClick={() => onToggle(seat)}
      className={`${sizeClass} border ${comfortClass} cursor-pointer flex items-center justify-center transition-all ${businessShadow}`}
    >
      <span className={`${textClass} text-ink`}>{seat.id}</span>
    </button>
  );
}
