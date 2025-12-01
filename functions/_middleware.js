// functions/_middleware.js

export async function onRequest(context) {
  const { request, env, next } = context;

  const expectedUser = env.BASIC_USER;
  const expectedPass = env.BASIC_PASS;

  const authHeader = request.headers.get("Authorization") || "";

  if (authHeader.startsWith("Basic ")) {
    try {
      // "Basic xyz..." -> Base64-Daten nach dem Leerzeichen
      const base64 = authHeader.slice(6);
      const decoded = atob(base64);
      const [user, pass] = decoded.split(":");

      if (user === expectedUser && pass === expectedPass) {
        // Login korrekt -> Seite normal ausliefern
        return next();
      }
    } catch (e) {
      // kaputter Header -> unten 401
    }
  }

  // Kein oder falscher Login -> Browser-Popup anzeigen
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="ABW Honorarnoten"',
      "Cache-Control": "no-store",
    },
  });
}
