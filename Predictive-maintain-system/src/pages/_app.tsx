import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { RealTimeDataProvider } from "../components/RealTimeDataContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RealTimeDataProvider>
      <Component {...pageProps} />
    </RealTimeDataProvider>
  );
}

export default MyApp;
