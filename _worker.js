export default {
  async fetch(request, env) {
    const expectedUser = env.BASIC_USER;
    const expectedPass = env.BASIC_PASS;

    const authHeader = request.headers.get("Authorization") || "";

    if (authHeader.startsWith("Basic ")) {
      try {
        const base64 = authHeader.slice(6);
        const decoded = atob(base64);
        const [user, pass] = decoded.split(":");

        if (user === expectedUser && pass === expectedPass) {
          // Seite normal ausliefern
          return env.ASSETS.fetch(request);
        }
      } catch (err) {}
    }

    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="ABW Honorarnoten"',
        "Cache-Control": "no-store",
      },
    });
  }
};
