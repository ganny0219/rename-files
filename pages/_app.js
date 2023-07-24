import "@/styles/globals.css";
import Layout from "@/components/layout/layout/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import { createContext, useState } from "react";

export const LoadingContext = createContext({
  loading: false,
  setLoad: () => {},
});

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);

  const value = {
    loading,
    setLoad: () => setLoading((prev) => !prev),
  };

  return (
    <>
      <LoadingContext.Provider value={value}>
        {loading && <LoadingScreen />}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LoadingContext.Provider>
    </>
  );
}
