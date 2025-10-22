// ...existing code...
import React, { useEffect, useRef } from "react";

type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: number;
  [key: string]: any;
};

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

interface TelegramLoginProps {
  redirectUrl: string;
  botUsername?: string; // e.g. "tradelive_24_v1_bot"
  size?: "large" | "medium" | "small";
  userpic?: "true" | "false";
  requestAccess?: "write" | "read";
}

const TelegramLogin: React.FC<TelegramLoginProps> = ({
  redirectUrl,
  botUsername = "tradelive_24_v1_bot",
  size = "large",
  userpic = "false",
  requestAccess = "write",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scriptId = "telegram-login-script";

  useEffect(() => {
    // attach global handler
    window.onTelegramAuth = function (user: TelegramUser) {
      // replace alert with your own handling
      alert(`Logged in as ${user.first_name} (${user.id})`);
      console.log("Telegram User:", user);
    };

    // cleanup existing script if present
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", size);
    script.setAttribute("data-userpic", userpic);
    script.setAttribute("data-request-access", requestAccess);
    script.setAttribute("data-auth-url", redirectUrl);

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      // cleanup
      window.onTelegramAuth = undefined;
      const cleanup = document.getElementById(scriptId);
      if (cleanup) cleanup.remove();
    };
  }, [redirectUrl, botUsername, size, userpic, requestAccess]);

  return (
    <div
      id="telegram-login"
      ref={containerRef}
      style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
    />
  );
};

export default TelegramLogin;
// ...existing code...
