import FingerprintJS from "@fingerprintjs/fingerprintjs";

let cachedDeviceId: string | null = null;

export async function getDeviceId(): Promise<string> {
  if (cachedDeviceId) return cachedDeviceId;

  const fp = await FingerprintJS.load();
  const result = await fp.get();
  cachedDeviceId = result.visitorId;
  return cachedDeviceId;
}

export function getUserAgent(): string {
  return navigator.userAgent;
}
