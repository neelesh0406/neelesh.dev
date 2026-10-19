import "../components/iphone-duo/foldable-phone.css";
import "../styles/phone-hero.css";
import "../styles/experience.css";
import "../styles/skills.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
