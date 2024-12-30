import dotenv from 'dotenv'
import { transporter } from "../config/nodemailer"
dotenv.config()

type EmailType = {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async ( user : EmailType ) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Confirma tu cuenta',
            text: 'UpTask - Confirma tu cuenta',
            html: `<p>Hola ${user.name}, has creado tu cuenta en UpTask</p>
                <h3>Confirma tu cuenta: 
                    <a href='${process.env.FRONTEND_URL}/auth/confirm-account'>Confirmar Cuenta</a>
                </h3>
                <p>E ingresa el código <b>${user.token}</b>  </p>
                <p>Este token expita en 10 minutos</p>
                `
        })
        console.log('Mensaje Enviado', info.messageId);
        
    }

    static sendPasswordResetToken = async ( user : EmailType ) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Restablece tu Password',
            text: 'UpTask - Restablece tu Password',
            html: `<p>Hola ${user.name}, has solicitado reestablecer tu password</p>
                <h3>Visita el siguiente enlace: 
                    <a href='${process.env.FRONTEND_URL}/auth/new-password'>Reestablecer Password</a>
                </h3>
                <p>E ingresa el código <b>${user.token}</b>  </p>
                <p>Este token expita en 10 minutos</p>
                `
        })
        console.log('Mensaje Enviado', info.messageId);
        
    }
}

