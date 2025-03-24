import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    subjects: [{ type: String, required: true }], // Array of subjects
    password: { type: String, required: true } // Store hashed password in production!
  },
  { collection: "teachers" }
);

const Teacher =
  mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);

export default Teacher;
