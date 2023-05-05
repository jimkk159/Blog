import { Suspense } from "react";
import { Await } from "react-router-dom";

export function SuspenseWrapper(component) {
  return <Suspense fallback={<p>Loading...</p>}>{component}</Suspense>;
}

export function AwaitWrapper({ children, resolve }) {
  return SuspenseWrapper(<Await resolve={resolve}>{children}</Await>);
}
