import type { Request, Response } from "express"
import User from "../models/User"
import Project from "../models/Project"

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response ) => {
        const {email} = req.body
        const user = await User.findOne({email}).select(' id email name')
        if(!user) {
            const error = new Error('Usuario no encontrado')
            res.status(404).json({error: error.message})
            return
        }
        res.json(user)
    }

    static addMemberById = async (req: Request, res: Response ) => {
        const {id} = req.body
        const user = await User.findById(id).select('id')

        if(!user) {
            const error = new Error('Usuario no encontrado')
            res.status(404).json({error: error.message})
            return
        }

        if(req.project.team.some(team => team.toString() === user.id)) {
            const error = new Error('El usuario ya existe en el projecto')
            res.status(409).json({error: error.message})
            return
        }


        req.project.team.push(user.id)
        await req.project.save()
        res.json('Usuario Agregado Correctamente')
    }
}