import React from "react";
import { Outlet } from "react-router-dom";

//CUSTOM
import Navigation from "../../shared/components/Navigation/Navigation";

function RootLayout() {
  return (
    <>
      <Navigation />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
