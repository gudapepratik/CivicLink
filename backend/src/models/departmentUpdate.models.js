import mongoose from "mongoose";

const docSchema = {
  publicUrl: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
}

const departmentUpdateSchema = mongoose.Schema(
  {
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    remark: {
      type: String,
      required: true
    },
    docs: [docSchema],
    updatedStatus: {
      type: String,
      enum: ["pending","inprogress","resolved","rejected"],
      required: true
    },
    expectedResolutionDate: {
      type: Date,
      required: true
    },
  },
  { timestamps: true }
);

export const DepartmentUpdate = mongoose.model("DepartmentUpdate", departmentUpdateSchema);
