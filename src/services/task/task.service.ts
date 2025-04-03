import TaskModel from "../../models/task/task. model";
import { PriorityStatus } from '../../interfac/task/taskInterfac';
import { Request, Response } from "express";
import { ParsedQs } from 'qs';
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

const searchTask = async(req: Request<{}, {}, {}, ParsedQs>, res: Response): Promise<Response> => {
    const {
        title,
        description,
        time, 
        priority,
        dueDate,
        completed,
        sortBy,
        sortOrder = 'asc',
        page = 1,
        limit =  12
    }  = req.query;
    const filter: any = {};
    // convert page and limit to number
    const pageNumber = typeof page === 'string' ? parseInt(page): 1;
    const limitNumber = typeof limit === 'string' ? parseInt(limit): 12;
    if (title) {
        filter.title = { $regex: title, $options: 'i'}
    }
    if (description) {
        filter.description = { $regex: description, $options: 'i'}
    }
    if (time) {
        filter.time = { $regex: time, $options: 'i'}
    }
    if (priority) {
        filter.priority = { $regex: priority, $options: 'i'}
    }
    if (dueDate) {
        filter.dueDate = {$regex: dueDate, $options: 'i'}
    }
    if (completed !== undefined) {
        filter.completed = completed === 'true'; 
    }
    try {
        // check if the sortoption is a string and if the sortorder is in a descending order.
        // if it is true, start the sorting one step back or move to the next item  in to sort.
        const sortOptions: any = {};
        if (sortBy &&  typeof sortBy === 'string') {
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }
        // count the total tasks matching the filter
        const totalTasks = await TaskModel.countDocuments(filter);
        // Find products and sort them from ascending to descending order and filter them by pagination logic
        const tasks = await TaskModel.find(filter)
        .sort(sortOptions)
        .skip((pageNumber - 1) * limitNumber)
        .limit(Number(limit)) 
        return res.status(StatusCodes.OK).json({
            success: true,
            tasks,
            totalTasks,
            availableTasks: Math.ceil(totalTasks / limitNumber),
            currentTask: pageNumber
        });
    } catch (error) {
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong."});
    }
}
export {
    createTask,
    fetchTasks,
    fetchTask,
    updateTask,
    removeTask,
    searchTask
}
