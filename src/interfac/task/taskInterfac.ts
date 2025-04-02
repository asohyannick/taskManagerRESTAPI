import { Document } from "mongoose";
export enum PriorityStatus {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High'
}
export interface taskInterfac extends Document {
    title:string;
    description:string;
    time: Date;
    priority: PriorityStatus;
    dueDate: Date;
    completed:boolean;
}
