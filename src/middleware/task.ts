import { Request, Response, NextFunction } from "express";
import Task, { TaskType } from "../models/Task";

declare global {
    namespace Express {
        interface Request {
            task: TaskType
        }
    }
}

export async function taskExist(req: Request, res: Response, next: NextFunction) {
    try {
        const {taskId} = req.params
        const task = await Task.findById(taskId)
        if(!task) {
            const error = new Error('Tarea no encontrada')
            res.status(404).json({error: error.message})
            return
        }
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({error: 'Tarea no encontrada'})
    }
}

export function taskBelongToProject(req: Request, res: Response, next: NextFunction) {
    try {
        if(req.task.project.toString() !== req.project.id.toString()) {
            const error = new Error('Accion no valida')
            res.status(400).json({error: error.message})
            return
        }
        next()
    } catch (error) {
        res.status(500).json({error: 'Tarea no encontrada'})
    }
}


