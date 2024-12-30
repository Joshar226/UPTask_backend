import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"

export class AuthController {
    static createAccount = async (req : Request, res: Response) => {
        try {
            const {password, email} = req.body

            //Prevenir duplicados
            const userExist = await User.findOne({email})
            if(userExist) {
                const error = new Error('El usuario ya esta registrado')
                res.status(409).json({error: error.message})
                return
            }

            //Crea un usuario
            const user = new User(req.body)

            // Hash password
            user.password = await hashPassword(password)

            //Crear Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //Enviar Email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            
            await Promise.allSettled([user.save(), token.save()])
            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static confirmAccount = async (req : Request, res: Response) => {
        try {
            const {token} = req.body            
            
            const tokenExist = await Token.findOne({token})
            if(!tokenExist) {
                const error = new Error('Token no válido')
                res.status(404).json({error: error.message})
                return
            }

            const user = await User.findById(tokenExist.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])
            res.send('Cuenta Confirmada Correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static login = async (req : Request, res: Response) => {
        try {
            const {email, password} = req.body

            const user = await User.findOne({email})
            if(!user) {
                const error = new Error('Usuario no encontrado')
                res.status(404).json({error: error.message})
                return
            }

            if(!user.confirmed) {
                const token = new Token()
                token.token = generateToken()
                token.user = user.id
                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('La cuentan no ha sido confirmada, hemos enviado un e-mail de confirmación')
                res.status(401).json({error: error.message})
                return
            }

            //Revisar Password
            const isPasswordCorrect = await checkPassword(password, user.password)

            if(!isPasswordCorrect) {
                const error = new Error('Password Incorrecto')
                res.status(401).json({error: error.message})
                return
            }

            res.send('Autenticado')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static requestConfirmationCode = async (req : Request, res: Response) => {
        try {
            const { email } = req.body

            //Usuario Existe
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error('Correo no encontrado')
                res.status(404).json({error: error.message})
                return
            }

            if(user.confirmed) {
                const error = new Error('El usuario ya esta confirmado')
                res.status(403).json({error: error.message})
                return 
            }

            //Crear Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            //Enviar Email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Se envió un nuevo token')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static forgotPassword = async (req : Request, res: Response) => {
        try {
            const { email } = req.body

            //Usuario Existe
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error('Correo no encontrado')
                res.status(404).json({error: error.message})
                return
            }

            //Crear Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            //Enviar Email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Revisa tu Email para Instrucciones')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static validateToken = async (req : Request, res: Response) => {
        try {
            const {token} = req.body            
            
            const tokenExist = await Token.findOne({token})
            if(!tokenExist) {
                const error = new Error('Token no válido')
                res.status(404).json({error: error.message})
                return
            }

            res.send('Token Confirmado')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updatePasswordWithToken = async (req : Request, res: Response) => {
        try {
            const {token} = req.params            
            
            const tokenExist = await Token.findOne({token})
            if(!tokenExist) {
                const error = new Error('Token no válido')
                res.status(404).json({error: error.message})
                return
            }
            
            const user = await User.findById(tokenExist.user)
            user.password = await hashPassword(req.body.password)

            await Promise.allSettled([tokenExist.deleteOne(), user.save()])
            
            res.send('Password Actualizado Correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}