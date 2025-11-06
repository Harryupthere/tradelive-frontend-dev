import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../utils/redux/slice"; // adjust path if your slice lives elsewhere

const base = import.meta.env.VITE_BASE || "/";

function decodeJwtPayload(token: string | null) {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const AuthWatcher = () => {
  const dispatch = useDispatch();
  const token = useSelector((s: any) => s?.auth?.token);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // clear previous timer
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!token) return;

    const payload = decodeJwtPayload(token);
    const exp = payload?.exp;
    if (!exp) {
      // invalid token -> logout immediately
      //dispatch(logout());
      //window.location.assign(`${base}login`);
      return;
    }

    const expiresAt = exp * 1000;
    const now = Date.now();
console.log(expiresAt,now)
    if (expiresAt <= now) {
      // token already expired
      //dispatch(logout());
      //window.location.assign(`${base}login`);
      return;
    }

    // schedule auto-logout at expiry (+ small buffer)
    const msUntilExpire = expiresAt - now + 1000;
    timeoutRef.current = window.setTimeout(() => {
     // dispatch(logout());
     // window.location.assign(`${base}login`);
    }, msUntilExpire) as unknown as number;

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [token, dispatch]);

  return null;
};

export default AuthWatcher;