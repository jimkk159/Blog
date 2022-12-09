import React from "react";
import { useRouteError } from "react-router-dom";
import Navigation from "../shared/components/Navigation/Navigation";

function ErrorPage() {
  const error = useRouteError;

  return (
    <>
      <Navigation />
      <main className="error">
        <h1>Opps! An error occurred!</h1>
        <p>{error.message}</p>
      </main>
    </>
  );
}

export default ErrorPage;
