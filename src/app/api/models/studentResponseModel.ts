import mongoose from "mongoose";

const StudentResponseSchema = new mongoose.Schema(
  {
    response_id: { type: String, required: true, unique: true }, // Unique response ID
    test_id: { type: String, required: true }, // Reference to test
    student_email: { type: String, required: true }, // Student who submitted
    responses: [
      {
        question: { type: String, required: true }, // Question text
        selected_option: { type: String, required: true } // Selected answer
      }
    ],
    submitted_at: { type: Date, default: Date.now }, // Submission time
    score: { type: Number, required: true } // Calculated score
  },
  { collection: "student_responses" }
);

const StudentResponse =
  mongoose.models.StudentResponse ||
  mongoose.model("StudentResponse", StudentResponseSchema);

export default StudentResponse;
