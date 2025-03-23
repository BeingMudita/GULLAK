const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MemorySchema = new Schema({
    title: {  // Changed "Title" -> "title"
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true
    },
    withPerson: {
        type: [String],
        default: []
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    imageUrl: {
        type: String,
        required: true
    },
    memoryDate: {  // Changed "memorydate" -> "memoryDate"
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Memory", MemorySchema);
