import { ReactNode } from "react";

type PaymentRowProps = {
  children: ReactNode;
};

export default function PaymentRow({ children }: PaymentRowProps) {
  return (
    <div className="flex bg-canvas">
      {children}
    </div>
  );
}