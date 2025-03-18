import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correct_answer: { type: String, required: true },
  explanation: { type: String, required: true }
});

const TopicSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String },
  difficulty_level: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  questions: { type: [QuestionSchema], required: true }
});

const Topic = mongoose.models.Topic || mongoose.model("Topic", TopicSchema);

export default Topic;
