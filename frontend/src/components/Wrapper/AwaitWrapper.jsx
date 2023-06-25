import { Suspense } from "react";
import { Await } from "react-router-dom";
import { PacmanLoader } from "react-spinners";

export function SuspenseWrapper(component, spinner) {
  const full = spinner?.full;
  const color = spinner?.color;

  return (
    <Suspense
      fallback={
        <div
          className={`${
            full && "h-screen"
          } flex w-full items-center justify-center`}
        >
          <PacmanLoader
            aria-label="Loading Spinner"
            size={20}
            color={color ? color : "white"}
          />
        </div>
      }
    >
      {component}
    </Suspense>
  );
}

export function AwaitWrapper({ resolve, spinner, children }) {
  return SuspenseWrapper(<Await resolve={resolve}>{children}</Await>, spinner);
}
