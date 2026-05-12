const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    user: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    designation: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied"
    },
    interviewDate: {
      type: String,
      default: ""
    },
    resume: {
        type: String
    },
    isDeletedByAdmin: {
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
)

const applications = mongoose.model('applications', applicationSchema)

module.exports = applications