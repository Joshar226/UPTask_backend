import { Request, Response } from "express"
import Project from "../models/Project";
import Task from "../models/Task";

export class TaskController {
    static createTask = async(req: Request, res: Response) => {
        const {projectId} = req.params
        const project = await Project.findById(projectId)

        if(!project) {
            const error = new Error('Proyecto no encontrado')
            res.status(404).json({error: error.message})
            return
        }
        
        try {
            const task = new Task(req.body)
            await task.save()
            res.send('Tarea Creada Correctamente')
            
        } catch (error) {
            console.log(error);
        }
    }
}