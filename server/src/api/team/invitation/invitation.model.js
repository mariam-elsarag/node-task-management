import mongoose, { Schema } from "mongoose";

const invitationsSchema = new mongoose.Schema(
  {
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team is required"],
    },
    invited_users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
      },
    ],
    invited_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Invited by is required"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.invitation_id = ret._id;
        delete ret._id;
      },
    },
  }
);

const Invitation = mongoose.model("Invitation", invitationsSchema);
export default Invitation;
