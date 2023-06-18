import { Suspense } from "react";
import { Await } from "react-router-dom";

// components
import { PacmanLoader } from "react-spinners";

export function SuspenseWrapper(component) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <PacmanLoader aria-label="Loading Spinner" size={20} color="white" />{" "}
        </div>
      }
    >
      {component}
    </Suspense>
  );
}

export function AwaitWrapper({ children, resolve }) {
  return SuspenseWrapper(<Await resolve={resolve}>{children}</Await>);
}
