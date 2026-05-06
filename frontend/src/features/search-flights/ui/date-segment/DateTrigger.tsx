type Props = {
  id: string;
  label: string;
  displayValue: string | null;
  onClick: () => void;
};

export function DateTrigger({ id, label, displayValue, onClick }: Props) {
  return (
    <div
      className="h-full cursor-pointer hover:bg-surface-soft transition-colors rounded-full flex flex-col justify-center px-6 min-h-[66px]"
      onClick={onClick}
    >
      <label className="font-caption text-caption text-ink font-bold" htmlFor={id}>
        {label}
      </label>
      <span
        className={`font-body-sm text-body-sm truncate ${
          displayValue ? "text-ink" : "text-muted"
        }`}
      >
        {displayValue ?? "Add dates"}
      </span>
    </div>
  );
}
