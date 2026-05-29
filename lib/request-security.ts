export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const requestUrl = new URL(request.url);
  const originUrl = new URL(origin);

  return originUrl.protocol === requestUrl.protocol && originUrl.host === requestUrl.host;
}

