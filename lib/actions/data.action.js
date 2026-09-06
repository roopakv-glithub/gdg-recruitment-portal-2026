import { connect, serializeFirestoreData } from "../db";

export async function getData() {
  try {
    const db = await connect();
    const snapshot = await db.collection("formData").get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      _id: doc.id,
      ...serializeFirestoreData(doc.data()),
    }));

    return { status: 200, data };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { status: 500, message: "Error fetching data" };
  }
}
