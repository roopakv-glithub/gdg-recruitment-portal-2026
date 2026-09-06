import { connect } from "../db";

const COLLECTION_NAME = "users";

class UserModel {
  constructor(data) {
    this.data = data;
  }

  async save() {
    const db = await connect();
    const docRef = await db.collection(COLLECTION_NAME).add({
      ...this.data,
      createdAt: new Date(),
    });
    const snapshot = await docRef.get();
    return { id: docRef.id, ...snapshot.data() };
  }

  static async create(user) {
    return new UserModel(user).save();
  }

  static async findOne(query = {}) {
    const db = await connect();
    const [field, value] = Object.entries(query)[0] || [];

    if (!field || value === undefined) return null;

    const snapshot = await db.collection(COLLECTION_NAME).where(field, "==", value).limit(1).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
}

export default UserModel;
