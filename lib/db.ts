import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { demoMode } from "./demo";
import { demoDb } from "./demo-server";

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "demo-DWASFW-rec";
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY?.replace(
  /\\n/g,
  "\n",
);
const GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS;

const hasServiceAccount =
  FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY;
const hasCredentials =
  hasServiceAccount || Boolean(GOOGLE_APPLICATION_CREDENTIALS) || Boolean(process.env.FIRESTORE_EMULATOR_HOST);

let cached: FirestoreConn = (global as any).firestore;

if (!cached) {
  cached = (global as any).firestore = {
    db: null,
  };
}

export const connect = async (): Promise<Firestore> => {
  if (demoMode) return demoDb as unknown as Firestore;
  if (!hasCredentials && process.env.NODE_ENV === "production" && !process.env.BUILDING) {
    throw new Error(
      "Please define GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local",
    );
  }

  if (cached.db) return cached.db;

  const appOptions: any = { projectId: FIREBASE_PROJECT_ID };
  if (FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    appOptions.credential = cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY,
    });
  }

  const app = getApps()[0] || initializeApp(appOptions);

  cached.db = getFirestore(app);
  console.log("Connected to Firestore");
  return cached.db;
};

export const serializeFirestoreData = (value: any): any => {
  if (value === null || value === undefined) return value;

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value?.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeFirestoreData(item));
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        serializeFirestoreData(item),
      ]),
    );
  }

  return value;
};
