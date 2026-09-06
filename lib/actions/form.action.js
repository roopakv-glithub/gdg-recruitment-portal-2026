import { connect } from "@/lib/db";

export const submitFormAction = async (formData) => {
  try {
    const db = await connect();
    const { Name, Email, RegistrationNumber, Phone, Pref, ...Questions } =
      formData;

    await db.collection("formData").add({
      Name,
      Email,
      RegistrationNumber,
      Phone,
      Pref,
      Questions,
      createdAt: new Date(),
    });

    return {
      success: true,
      message: "Form submitted successfully!",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
