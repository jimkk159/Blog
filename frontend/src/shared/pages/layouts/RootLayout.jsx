import React from "react";
import { Outlet } from "react-router-dom";

//Custom Component
import Navigation from "../../components/Navigation/Navigation";
import Footer from "../../components/Footer/Footer";

function RootLayout() {
  return (
    <>
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default RootLayout;
