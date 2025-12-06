import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    atlassianAccountId: {
      type: String,
      unique: true,
      sparse: true // allows null + unique constraint
    },

    jiraTokens: {
      accessToken: { type: String },
      refreshToken: { type: String },
      expiresAt: { type: Date }
    },

    displayName: { type: String },

  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;
