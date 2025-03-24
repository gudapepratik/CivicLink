import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    logo: {
        type: String,
        required: true
    },
    heroImage: {
        type: String,
        required: true
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    mission: {
      type: String,
      required: true,
      trim: true
    },
    responsibilities: {
      type: [String],
      required: true
    },
    services: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        details: { type: [String], required: true }
      }
    ],
    commonIssues: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true }
      }
    ],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ],
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    hours: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      minlength: [10, 'Address must be at least 10 characters long']
    }
  },
  { timestamps: true }
);

// Add pagination plugin
departmentSchema.plugin(aggregatePaginate);

export const Department = mongoose.model('Department', departmentSchema);
