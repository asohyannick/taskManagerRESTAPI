import mongoose, { Schema } from "mongoose";
import { taskInterfac, PriorityStatus } from "../../interfac/task/taskInterfac";
const taskSchema: Schema = new Schema<taskInterfac>({
    title:{
        type:String,
        trim: true,
        unique: true,
        minlength: 3
    },
    description:{
        type: String,
        trim: true,
    },
    time:{
        type: Date,
        default: Date.now
    },
    priority:{
        type:String,
        enum:Object.values(PriorityStatus),
    },
    dueDate:{
        type: Date,
        default: Date.now,
    },
    completed:{
        type: Boolean,
        default: false
    },
}, {timestamps: true});

const TaskModel = mongoose.model('Task', taskSchema);
export default TaskModel;
