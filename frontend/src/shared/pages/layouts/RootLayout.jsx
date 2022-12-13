import React, { useContext } from "react";
import { Outlet } from "react-router-dom";

//Custom Context
import { AuthContext } from "../../context/auth-contex";

//Custom Component
import Navigation from "../../components/Navigation/Navigation";
import Footer from "../../components/Footer/Footer";
import AuthModal from "../../../users/components/AuthModal";

function RootLayout() {
  const { isLoggedIn, showModal } = useContext(AuthContext);
  return (
    <>
      {!isLoggedIn && showModal && <AuthModal />}
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default RootLayout;
