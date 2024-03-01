import { Request, Response } from "express"
import { invalidBody, unknownServerError } from "./common.js"
import { db } from "../context.js";
import { User } from "../types.js";
import { NoResultError } from "kysely";

export async function loginForm(req: Request, res: Response): Promise<void> {
    if (req.cookies.auth === "true") {
        res.redirect('/dashboard');
        return;
    }

    const wrongUsername: boolean = (req as any).id === "wrongUsername";
    const wrongPassword: boolean = (req as any).id === "wrongPassword";

    const message = wrongUsername 
        ? "Usuario incorrecto" 
        : wrongPassword
            ? "Contraseña incorrecta"
            : "";

    res.send(`
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title></title>
            <meta name="description" content="">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="/login.css" type="text/css">
        </head>
        <body>
            <div class="image">
                <object class="image--form" data="/assets/medicine.svg" width="500" height="500"></object>
            </div>
            <form action="/" method="post">
                <h2>Bienvenido</h2>
                <div>${message}</div>
                <div class="input--container">
                    <label for="user">Usuario:</label>
                    <input type="text" id="user" name="username"/>
                </div>
                <div class="input--container">
                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" name="password"/>
                </div>
                <input class="submit--btn" type="submit" value="Enviar">
            </form>
        </body>
    </html>
    `);
}

export async function logOut(_: Request, res: Response): Promise<void> {
    res.clearCookie('userType');
    res.clearCookie('auth');
    res.redirect('/');
}

export async function logUser(req: Request, res: Response): Promise<void> {
    if (!isValidLogObject(req.body)) return invalidBody(res);

    let user: User;
    try {
        user = await db.selectFrom("users")
            .selectAll()
            .where("username", "=", req.body.username)
            .executeTakeFirstOrThrow();
    } catch (err) {
        if (err instanceof NoResultError) {
            res.redirect('/wrongUsername');
            return;
        } else { 
            return unknownServerError(res, err); 
        }
    }

    if (req.body.password === user.passw) {
        //reset cookie for userType
        res.clearCookie('userType');
        res.cookie('userType', user.utype);

        //reset Auth cookie
        res.clearCookie('auth');
        res.cookie('auth', 'true');
        
        //reset userId Cookie
        res.clearCookie('userId');
        res.cookie('userId', user.id);

        //redirect to the dasboard
        res.redirect('/dashboard');
    } else {
        res.redirect('/wrongPassword');
    }
}

function isValidLogObject(obj: any): obj is { username: string; password: string } {
    return typeof obj.username == "string"
        && typeof obj.password == "string";
}