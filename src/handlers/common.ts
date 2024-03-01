import { Request, Response } from "express";
import { db } from "../context.js";
import { Consultation } from "../types.js";
import { NoResultError } from "kysely";

enum UserType {
    ADMIN     = 0,
    PHYSICIAN = 1,
    SECRETARY = 2
}

export function unknownServerError(res: Response, err: unknown): void {
    res.status(500).send("Unknown server error: " + err);
}

export function invalidBody(res: Response): void {
    res.status(400).send("Invalid body");
}

export async function dashboard(req: Request, res: Response): Promise<void> {
    if (req.cookies == "undefined" || 
       !req.cookies.userType || 
        req.cookies.userType == "undefined") {
        res.redirect('/');
    }

    const userType: UserType = Number(req.cookies.userType);

    switch(userType) {
        case UserType.ADMIN: {
            res.render('dashboardSuperuser', {});
            break;
        }
        case UserType.PHYSICIAN: {
            res.render('dashboardDoctor', {
                consultations: await getConsultations(req.cookies.userId)
            });
            break;
        }
        case UserType.SECRETARY: {
            res.render('dashboardSecretary', {
                consultations: await getConsultations(req.body.doctorId)
            });
            break;
        }
    }
};

/*async function getPatientHistory() : Promise<string>{
    let history : Consultation;
    try {
        history = await db.selectFrom("consultations")
            .selectAll()
            .where("patient_id", "=", 1)
            .executeTakeFirstOrThrow();
            console.log(history);
            return(history.id.toString());
    } catch (err) {
        console.log(err);
    }
    return "Nothing";
    
}*/

async function getConsultations(id: number) : Promise<Consultation[]>{
    console.log("attempting to retrieve consultations for id:", id);
    try {
        const consultations: Consultation[] = await db.selectFrom("consultations")
            .selectAll()
            .where("physician_id", "=", id)
            .execute();
        return consultations;
    } catch (err) {
        if (err instanceof NoResultError) {
            return [];
        }
        else throw err;
    }
    return [];
}
