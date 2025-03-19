import mongoose from "mongoose";

const NotesSchema = new mongoose.Schema({
    title: {
        type: String,
    }
}, {
    timestamps: true
});

const NotesModel = mongoose.model("Notes", NotesSchema);
export default NotesModel;