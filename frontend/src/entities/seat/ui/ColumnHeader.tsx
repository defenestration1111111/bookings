type Props = {
  columnGroups: string[][];
  seatClass: string;
};

export function ColumnHeader({ columnGroups, seatClass }: Props) {
  const colWidth = seatClass === "Business" ? "w-14" : "w-11";

  return (
    <div className="flex justify-center gap-6 mb-2">
      {columnGroups.map((group, gi) => (
        <>
          {gi > 0 && <div key={`spacer-${gi}`} className="w-8" />}
          <div key={gi} className="flex gap-2">
            {group.map((col) => (
              <div
                key={col}
                className={`${colWidth} h-6 flex items-center justify-center font-caption text-caption text-muted`}
              >
                {col}
              </div>
            ))}
          </div>
        </>
      ))}
    </div>
  );
}