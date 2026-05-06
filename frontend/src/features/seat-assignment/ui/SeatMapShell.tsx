import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function SeatMapShell({ children }: Props) {
  return (
    <div className="w-full max-w-[500px] overflow-x-auto pb-8">
      <div className="min-w-[400px] bg-surface-bright border border-hairline-soft rounded-t-[140px] rounded-b-[60px] p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative mx-auto">
        <div className="w-full flex justify-center mb-16">
          <div className="w-24 h-1 bg-hairline rounded-full" />
        </div>
        {children}
      </div>
    </div>
  );
}