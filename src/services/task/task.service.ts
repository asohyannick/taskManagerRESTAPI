import TaskModel from "../../models/task/task. model";
import { PriorityStatus } from '../../interfac/task/taskInterfac';
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const createTask = async(req: Request, res: Response): Promise<Response> => {
    const {
        title,
        description,
    } = req.body;
    try {
        const newTask = new TaskModel({
            title,
            description,
            time: Date.now(),
            priority: PriorityStatus.MEDIUM,
            dueDate: Date.now(),
            completed: true
        });
        await newTask.save();
      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Task has been created successfully",
        newTask
      });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong."});
    }
}

const fetchTasks = async(req: Request, res: Response): Promise<Response> => {
    try {
        const retrieveTasks = await TaskModel.find();
        return res.status(StatusCodes.OK).json({message: "Tasks have been fetched successfully", retrieveTasks});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong."});
    }
}

const fetchTask = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const retrieveTask = await TaskModel.findById(id);
        if (!retrieveTask) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Task does not exist!"});
        }
        return res.status(StatusCodes.OK).json({message: "Task has been fetched successfully", retrieveTask});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong."});
    }
}

const updateTask = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const updateExistingTask = await TaskModel.findByIdAndUpdate(id, req.body, {new: true});
        if (!updateExistingTask) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Task does not exist!"});
        }
        return res.status(StatusCodes.OK).json({message: "Task has been updated successfully!", updateExistingTask});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong."});
    }
}

const removeTask = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const eradicateTask = await TaskModel.findByIdAndDelete(id);
        if (!eradicateTask) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Task does not exist!"});
        }
        return res.status(StatusCodes.OK).json({message: "Task has been deleted successfully!", eradicateTask});
    } catch (error) {
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong."});
    }
}

export {
    createTask,
    fetchTasks,
    fetchTask,
    updateTask,
    removeTask
}
