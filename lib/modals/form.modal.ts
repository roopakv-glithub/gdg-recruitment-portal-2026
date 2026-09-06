import { connect } from "../db";

export interface IFormData {
  id?: string;
  Name: string;
  Email: string;
  RegistrationNumber: string;
  Phone: string;
  Pref: string;
  Department: string;
  Questions: Record<string, string>;
  shortlisted?: boolean;
}

const COLLECTION_NAME = "formData";

const formatDoc = (doc: any) => {
  const data = doc.data ? doc.data() : doc;
  return {
    id: doc.id,
    _id: doc.id,
    ...data,
  };
};

class FormDataModel {
  private data: IFormData;

  constructor(data: IFormData) {
    this.data = {
      ...data,
      shortlisted: false,
    };
  }

  async save() {
    const db = await connect();
    const docRef = await db.collection(COLLECTION_NAME).add({
      ...this.data,
      createdAt: new Date(),
    });
    const snapshot = await docRef.get();
    return formatDoc(snapshot);
  }

  static async create(data: IFormData) {
    return new FormDataModel(data).save();
  }

  static async find(query: Partial<IFormData> = {}) {
    const db = await connect();
    let ref: any = db.collection(COLLECTION_NAME);

    if (query.Email) ref = ref.where("Email", "==", query.Email);
    if (query.Department) ref = ref.where("Department", "==", query.Department);

    const snapshot = await ref.get();
    return snapshot.docs.map((doc: any) => formatDoc(doc));
  }

  static async findOne(query: Partial<IFormData> = {}) {
    const results = await FormDataModel.find(query);
    return results[0] || null;
  }

  static async countDocuments(query: Partial<IFormData> = {}) {
    const results = await FormDataModel.find(query);
    return results.length;
  }

  static async findByIdAndUpdate(
    id: string,
    update: Partial<IFormData> | { $set?: Partial<IFormData> },
  ) {
    const db = await connect();
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const updateData =
      update && typeof update === "object" && "$set" in update
        ? update.$set
        : update;

    await docRef.update(updateData ?? {});
    const snapshot = await docRef.get();
    return snapshot.exists ? formatDoc(snapshot) : null;
  }

  static async findById(id: string) {
    const db = await connect();
    const snapshot = await db.collection(COLLECTION_NAME).doc(id).get();
    return snapshot.exists ? formatDoc(snapshot) : null;
  }
}

export default FormDataModel;
