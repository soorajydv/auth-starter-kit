import mongoose, { Schema, Query, Aggregate } from "mongoose"
import { MONGODB_URI, NODE_ENV } from "./env.cofig"

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log(`MongoDB connected in ${NODE_ENV} mode`)
  } catch (error) {
    console.error("MongoDB connection failed:", error)
    process.exit(1)
  }
}

export const softDeletePlugin = (schema: Schema): void => {
  function excludeDeleted(this: Query<any, any>, next: () => void): void {
    const includeDeleted = this.getOptions().includeDeleted;

    if (!includeDeleted) {
      const query = this.getQuery();
      if (!('deletedAt' in query)) {
        this.where({ deletedAt: undefined });
      }
    }

    next();
  }

  schema.pre('find', excludeDeleted);
  schema.pre('findOne', excludeDeleted);
  schema.pre('findOneAndUpdate', excludeDeleted);
  schema.pre('countDocuments', excludeDeleted);

  schema.pre('aggregate', function (this: Aggregate<any>, next: () => void): void {
    const pipeline = this.pipeline();
    const firstStage = pipeline[0];

    const options = this.options || {};
    if (!options.includeDeleted) {
      if (!firstStage || !(firstStage as { $match?: any }).$match) {
        pipeline.unshift({ $match: { deletedAt: undefined } });
      } else {
        (firstStage as { $match?: any }).$match.deletedAt = (firstStage as { $match?: any }).$match.deletedAt ?? undefined;
      }
    }

    next();
  });
};

