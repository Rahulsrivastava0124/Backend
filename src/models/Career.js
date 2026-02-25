const mongoose = require("mongoose");

const CareerSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    job_type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    experience_level: {
      type: String,
      required: true,
    },
    salary_range: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [String],
    ending_date: {
      type: Date,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Career", CareerSchema);
