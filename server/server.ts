import InterviewController from "./app/controller/interview";

require("dotenv").config({ path: "./environment-composers/.env" });
import App from "./app";
import CompanyPriorityController from "./app/controller/companyPriority";
import "reflect-metadata";
import { createConnection } from "typeorm";
import ormDBConfig from "./ormconfig";
import InterviewDetailsController from "./app/controller/interviewDetails";
import InterviewNotesController from "./app/controller/interviewNotes";
import PracticeProblemController from "./app/controller/practiceProblems";

createConnection(ormDBConfig)
    .then((conn) => {
        const app = new App(
            [
                new CompanyPriorityController(),
                new InterviewController(),
                new InterviewDetailsController(),
                new InterviewNotesController(),
                new PracticeProblemController()
            ],
            48614,
        );
        app.listen();
    })
    .catch((err) => {
        console.log("Error while connecting to the database", err);
        return err;
    });