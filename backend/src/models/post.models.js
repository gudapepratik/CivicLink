import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const imageSchema = {
  publicUrl: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
}

const locationSchema = {
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
};

const postSchema = mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true
    },
    imageUrls: [imageSchema],
    status: {
      type: String,
      enum: ["pending","inprogress","resolved","rejected"],
      default: "pending"
    },
    location: locationSchema,
  },
  { timestamps: true }
);

// index the location as a 2dsphere index
postSchema.index({ location: "2dsphere" })
// postSchema.createIndex({location},"2dsphere")
// aggregate paginate plugin
postSchema.plugin(aggregatePaginate);

export const Post = mongoose.model("Post", postSchema);
