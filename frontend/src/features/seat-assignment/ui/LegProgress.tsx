type Props = {
  totalLegs: number;
  currentLeg: number;
};

export function LegProgress({ totalLegs, currentLeg }: Props) {
  if (totalLegs <= 1) return null;

  return (
    <div className="flex gap-1.5">
      {Array.from({ length: totalLegs }, (_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${
            i < currentLeg
              ? "bg-rausch"
              : i === currentLeg
              ? "bg-rausch/40"
              : "bg-hairline"
          }`}
        />
      ))}
    </div>
  );
}