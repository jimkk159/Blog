import { redirect } from "react-router-dom";

export const getTokenDuration = (token) =>
  getTokenExpiredAt(token) - Date.now();

export const getAuthToken = () => localStorage.getItem("token");

export const checkAuthTokenLoader = () => {
  const token = getAuthToken();

  if (!token) return redirect("/auth");
  return null
};

export const getTokenExpiredAt = (token) => {
  const tokenParts = token.split(".");
  const encodedPayload = tokenParts[1];
  const rawPayload = window.atob(encodedPayload);
  return JSON.parse(rawPayload).exp * 1000;
};

export const isTokenExpired = (token) => {
  const expirationTime = getTokenExpiredAt(token);
  const currentTime = Math.floor(Date.now() / 1000);
  return expirationTime < currentTime;
};
