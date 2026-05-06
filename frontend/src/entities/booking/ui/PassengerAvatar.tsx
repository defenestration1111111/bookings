export function PassengerAvatar({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="w-8 h-8 rounded-full bg-surface-soft flex items-center justify-center text-[11px] font-bold text-ink">
      {initials}
    </div>
  );
}