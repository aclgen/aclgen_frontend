import { ReactNode } from "react";

export function If({
  children,
  condition,
}: {
  condition: boolean;
  children: ReactNode;
}) {
  if (condition) {
    return <>{children}</>;
  } else {
    return <></>;
  }
}
