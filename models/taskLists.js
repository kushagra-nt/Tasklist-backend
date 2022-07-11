import mongoose from "mongoose";

const taskListSchema = new mongoose.Schema({
  tasks: {
    type: [],
    default: [],
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  active: Boolean,
});

export default mongoose.model("taskLists", taskListSchema);
