import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function OauthPage() {
  //React Router
  const searchParams = useSearchParams()[0];
  useEffect(() => {
    localStorage.setItem(
      "userData",
      JSON.stringify({
        uid: searchParams.get("uid"),
        isAdmin: searchParams.get("admin"),
        name: searchParams.get("name"),
        avatar: searchParams.get("avatar"),
        token: searchParams.get("token"),
        theme: searchParams.get("theme"),
        language: searchParams.get("language"),
        expiration: new Date(
          new Date().getTime() + 3 * 60 * 60 * 1000 //Token Lifecycle is 1h
        ).toISOString(),
      })
    );
    window.close();
  }, [searchParams]);
}

export default OauthPage;
