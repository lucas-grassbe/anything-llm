import { createContext, useEffect, useState } from "react";
import VibranixFallback from "./media/logo/anything-llm.png";
import VibranixFallbackDark from "./media/logo/anything-llm-dark.png";
import DefaultLoginLogoLight from "./media/illustrations/login-logo.svg";
import DefaultLoginLogoDark from "./media/illustrations/login-logo-light.svg";

// Public-facing Vibranix assets (place your files in frontend/public/)
const PUBLIC_VIBRANIX_LOGO = "/vibranix_logo.png";
const PUBLIC_VIBRANIX_LOGIN_LOGO = "/vibranix_login_logo.svg";
const PUBLIC_VIBRANIX_LOGO_DARK = "/vibranix_logo_dark.png";
import System from "./models/system";

export const REFETCH_LOGO_EVENT = "refetch-logo";
export const LogoContext = createContext();

export function LogoProvider({ children }) {
  const [logo, setLogo] = useState("");
  const [loginLogo, setLoginLogo] = useState("");
  const [isCustomLogo, setIsCustomLogo] = useState(false);
  const DefaultLoginLogo =
    localStorage.getItem("theme") !== "default"
      ? DefaultLoginLogoDark
      : DefaultLoginLogoLight;

  // Utility to check whether a public asset exists (avoid 404s in console)
  async function publicAssetExists(url) {
    try {
      const resp = await fetch(url, { method: "HEAD" });
      return resp.ok;
    } catch (e) {
      return false;
    }
  }

  async function fetchInstanceLogo() {
    try {
      const { isCustomLogo, logoURL } = await System.fetchLogo();
      if (logoURL) {
        setLogo(logoURL);
        setLoginLogo(isCustomLogo ? logoURL : DefaultLoginLogo);
        setIsCustomLogo(isCustomLogo);
      } else {
        // Prefer public Vibranix assets if available (drop files into frontend/public)
        const prefersDark = localStorage.getItem("theme") !== "default";
        const candidateLogo = prefersDark
          ? PUBLIC_VIBRANIX_LOGO_DARK
          : PUBLIC_VIBRANIX_LOGO;
        const hasLogo = await publicAssetExists(candidateLogo);
        const loginCandidate = PUBLIC_VIBRANIX_LOGIN_LOGO;
        const hasLoginLogo = await publicAssetExists(loginCandidate);

  setLogo(hasLogo ? candidateLogo : prefersDark ? VibranixFallbackDark : VibranixFallback);
  setLoginLogo(hasLoginLogo ? loginCandidate : DefaultLoginLogo);
        setIsCustomLogo(false);
      }
    } catch (err) {
      const prefersDark = localStorage.getItem("theme") !== "default";
      const candidateLogo = prefersDark
        ? PUBLIC_VIBRANIX_LOGO_DARK
        : PUBLIC_VIBRANIX_LOGO;
      const loginCandidate = PUBLIC_VIBRANIX_LOGIN_LOGO;
      // best-effort: try to use public assets but fall back to bundled logos
  const hasLogo = await publicAssetExists(candidateLogo);
  const hasLoginLogo = await publicAssetExists(loginCandidate);

  setLogo(hasLogo ? candidateLogo : prefersDark ? VibranixFallbackDark : VibranixFallback);
  setLoginLogo(hasLoginLogo ? loginCandidate : DefaultLoginLogo);
      setIsCustomLogo(false);
      console.error("Failed to fetch logo:", err);
    }
  }

  useEffect(() => {
    fetchInstanceLogo();
    window.addEventListener(REFETCH_LOGO_EVENT, fetchInstanceLogo);
    return () => {
      window.removeEventListener(REFETCH_LOGO_EVENT, fetchInstanceLogo);
    };
  }, []);

  return (
    <LogoContext.Provider value={{ logo, setLogo, loginLogo, isCustomLogo }}>
      {children}
    </LogoContext.Provider>
  );
}
