import { Range } from "../types/common";

type DoubleRangeProps = {
  min: number;
  max: number;
  step?: number;
  range: Range;
  onChange: (range: Range) => void;
  onCommit?: (range: Range) => void;
  tone?: "rausch" | "ink";
};

// ---- helper ----
function clampRange(
  [low, high]: Range,
  changed: "low" | "high",
  value: number
): Range {
  if (changed === "low") {
    return [Math.min(value, high), high];
  }

  return [low, Math.max(value, low)];
}

// ---- component ----
export default function DoubleRange({
  min,
  max,
  step = 1,
  range,
  onChange,
  onCommit,
  tone = "rausch"
}: DoubleRangeProps) {
  const left = ((range[0] - min) / (max - min)) * 100;
  const right = 100 - ((range[1] - min) / (max - min)) * 100;

  const fillClass = tone === "rausch" ? "bg-rausch" : "bg-ink";
  const thumbClass = tone === "rausch" ? "border-rausch" : "border-ink";
  const commit = () => onCommit?.(range);

  return (
    <div className="range-shell h-4 relative mb-4">
      <div className="absolute top-1/2 -translate-y-1/2 h-1 bg-hairline rounded-full w-full" />

      <div
        className={`absolute top-1/2 -translate-y-1/2 h-1 ${fillClass} rounded-full`}
        style={{
          left: `${left}%`,
          right: `${right}%`
        }}
      />

      <input
        type="range"
        aria-label="Minimum value"
        className="range-input"
        min={min}
        max={max}
        step={step}
        value={range[0]}
        onChange={(event) =>
          onChange(
            clampRange(range, "low", Number(event.target.value))
          )
        }
        onMouseUp={commit}
        onTouchEnd={commit}
        onKeyUp={commit}
        onBlur={commit}
      />

      <input
        type="range"
        aria-label="Maximum value"
        className="range-input"
        min={min}
        max={max}
        step={step}
        value={range[1]}
        onChange={(event) =>
          onChange(
            clampRange(range, "high", Number(event.target.value))
          )
        }
        onMouseUp={commit}
        onTouchEnd={commit}
        onKeyUp={commit}
        onBlur={commit}
      />

      <span
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-canvas border-2 ${thumbClass} rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)]`}
        style={{ left: `${left}%` }}
      />

      <span
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-canvas border-2 ${thumbClass} rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)]`}
        style={{ left: `${100 - right}%` }}
      />
    </div>
  );
}
