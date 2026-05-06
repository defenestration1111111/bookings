export function NextButton({
  onClick,
  label,
  type = "button",
  disabled = false,
}: {
  onClick?: () => void;
  label: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="bg-rausch text-white font-title-md text-title-md rounded-lg px-6 h-[48px] hover:bg-rausch-active transition-colors flex items-center gap-2 active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
    >
      {label}
      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
    </button>
  );
}

export function BackButton({ onClick, label = "Back" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-hairline text-ink font-title-md text-title-md rounded-lg px-6 h-[48px] hover:bg-surface-soft transition-colors flex items-center gap-2 active:scale-95 duration-200"
    >
      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
      {label}
    </button>
  );
}