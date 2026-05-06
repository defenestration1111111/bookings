export function TripToggle({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group hover:opacity-100 transition-opacity">
      <input checked={active} className="sr-only" type="radio" onChange={onClick} />
      <span className="w-[22px] h-[22px] rounded-full border-2 border-white flex items-center justify-center transition-all">
        <span
          className={`w-[10px] h-[10px] rounded-full ${
            active ? "bg-[#ff385c]" : "bg-transparent group-hover:bg-white/20"
          }`}
        />
      </span>
      <span className="text-base tracking-tight">{children}</span>
    </label>
  );
}