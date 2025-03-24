import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    class: { type: String, required: true },
    course: { type: String, required: true },
    subjects: [{ type: String, required: true }], // Array of subjects
    password: { type: String, required: true } // Store hashed password in production!
  },
  { collection: "students" }
);

const Student =
  mongoose.models.Student || mongoose.model("Student", StudentSchema);

export default Student;
