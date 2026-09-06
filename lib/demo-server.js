import "server-only";
import { randomUUID } from "node:crypto";

const state = globalThis.__recruitmentDemo ??= { sessions: new Map(), collections: new Map() };
const cookieName = "recruitment-demo-session";

async function getSession({ headers }) {
  const token = headers.get("cookie")?.split(";").map(x => x.trim())
    .find(x => x.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  const session = state.sessions.get(token);
  return session && new Date(session.session.expiresAt) > new Date() ? session : null;
}

export const demoAuth = {
  api: { getSession },
  async handler(request) {
    const path = new URL(request.url).pathname;
    if (request.method === "GET" && path.endsWith("/get-session")) {
      return Response.json(await getSession({ headers: request.headers }));
    }
    if (request.method === "POST" && path.endsWith("/demo-login")) {
      const token = randomUUID();
      const expiresAt = new Date(Date.now() + 86400000).toISOString();
      const user = { id: "demo-candidate", name: "Demo Candidate", email: "demo@example.com", emailVerified: true, role: "user", image: null };
      state.sessions.set(token, { user, session: { id: token, token, userId: user.id, expiresAt } });
      return Response.json({ user }, { headers: { "Set-Cookie": `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400` } });
    }
    if (request.method === "POST" && path.endsWith("/sign-out")) {
      const session = await getSession({ headers: request.headers });
      if (session) state.sessions.delete(session.session.token);
      return Response.json({ success: true }, { headers: { "Set-Cookie": `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0` } });
    }
    return Response.json({ message: "Use the demo login button while demo mode is enabled." }, { status: 400 });
  },
};

// Only the Firestore operations used by this app; data lasts until server restart.
export const demoDb = {
  collection(name) {
    if (!state.collections.has(name)) state.collections.set(name, new Map());
    const rows = state.collections.get(name);
    const snapshot = (id) => ({ id, exists: rows.has(id), data: () => structuredClone(rows.get(id)) });
    const doc = (id) => ({
      id,
      get: async () => snapshot(id),
      update: async (data) => {
        if (!rows.has(id)) throw new Error("Document not found");
        rows.set(id, { ...rows.get(id), ...structuredClone(data) });
      },
    });
    const query = (filters = [], limit = Infinity) => ({
      where(field, operator, value) {
        if (operator !== "==") throw new Error("Unsupported demo query");
        return query([...filters, [field, value]], limit);
      },
      limit: (count) => query(filters, count),
      select: () => query(filters, limit),
      async get() {
        const docs = [...rows.keys()].filter(id => filters.every(([key, value]) => rows.get(id)[key] === value)).slice(0, limit).map(snapshot);
        return { docs, size: docs.length, empty: docs.length === 0 };
      },
    });
    return { ...query(), doc, async add(data) {
      const id = randomUUID();
      rows.set(id, structuredClone(data));
      return doc(id);
    } };
  },
};
