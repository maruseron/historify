import { NewUser } from "../types.js";

export function isNewUser(obj: any): obj is NewUser {
    return typeof obj.username == "string"
        && typeof obj.passw == "string"
        && (obj.utype == "1" || obj.utype == "2");
}


//Esto no supe adaptarlo, qué habría qué hacer en este caso
export function isUserUpdate(_: any) {}