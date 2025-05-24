import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { RealTimeDataProvider } from "../components/RealTimeDataContext";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RealTimeDataProvider>
      <Head>
        <title>Predictive Maintenance System</title>
      </Head>
      <Component {...pageProps} />
    </RealTimeDataProvider>
  );
}

export default MyApp;
