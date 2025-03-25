import mongoose from "mongoose";

const McqTestSchema = new mongoose.Schema(

  {
    test_id: { type: String, required: true, unique: true }, // Unique test ID
    title: { type: String, required: true },
    teacher_email: { type: String, required: true },
    subject: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correct_option: { type: String, required: true }
      }
    ],
    created_at: { type: Date, default: Date.now }, // Corrected to match JSON field
    status: { type: String, enum: ["Active", "closed"], default: "Active" }
  },
  { collection: "mcq_tests" }
);

export default mongoose.models.mcq_tests || mongoose.model("mcq_tests", McqTestSchema);

