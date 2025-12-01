// _worker.js – Basic Auth für deine gesamte Pages-Site

export default {
  async fetch(request, env) {
    const expectedUser = env.BASIC_USER;
    const expectedPass = env.BASIC_PASS;

    const authHeader = request.headers.get("Authorization") || "";

    if (authHeader.startsWith("Basic ")) {
      try {
        const base64 = authHeader.slice(6);        // alles nach "Basic "
        const decoded = atob(base64);              // z.B. "user:pass"
        const [user, pass] = decoded.split(":");

        if (user === expectedUser && pass === expectedPass) {
          // Login korrekt → statische Dateien ausliefern
          return env.ASSETS.fetch(request);
        }
      } catch (err) {
        // Ignorieren, fällt unten auf 401 zurück
      }
    }

    // Kein oder falscher Login → Browser-Popup anzeigen
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="ABW Honorarnoten"',
        "Cache-Control": "no-store",
      },
    });
  }
};

