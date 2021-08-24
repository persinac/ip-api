import { Request, Response, Router, NextFunction } from "express";
import { getRepository } from "typeorm";
import HttpException from "../exceptions/HttpException";
import CannotFindOrderDetailsWithOrderException
    from "../exceptions/orderDetail/CannotFindOrderDetailsWithOrderException";
import OrderDetailNotFoundException from "../exceptions/orderDetail/OrderDetailNotFoundException";
import CannotCreateOrderDetailException from "../exceptions/orderDetail/CannotCreateOrderDetailException";
import nonRequestOrderDetailValidation from "../middleware/validations/nonRequestOrderDetailValidation";
import { ValidationError } from "class-validator";
import { AuditUtility } from "../middleware/objectUtilities/AuditUtility";
import CompanyPriorityNotFoundException from "../exceptions/companyPriority/CompanyPriorityNotFoundException";
import { PracticeProblem } from "../entities/PracticeProblem";

/***
 * TODO:
 *  - Update errors
 *
 * **/
class PracticeProblemController {
    public path = "/practice-problem";
    public router = Router();
    private practiceProblemRepository = getRepository(PracticeProblem);

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getAllProblems);
        this.router.get(`${this.path}/:problemId`, this.getProblemById);
        this.router.post(this.path, this.createProblem);
        this.router.put(`${this.path}/:problemId`, this.updateProblem);
    }

    private getProblemById = (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.problemId;
        this.practiceProblemRepository.findOne(id)
            .then((result: PracticeProblem) => {
                result ? response.send(result) : next(new OrderDetailNotFoundException(id));
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    private getAllProblems = (request: Request, response: Response, next: NextFunction) => {
        this.practiceProblemRepository.createQueryBuilder("p")
            .getMany()
            .then((result: PracticeProblem[]) => {
                response.send(result);
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    private createProblem = (request: Request, response: Response, next: NextFunction) => {
        let practiceProblem: PracticeProblem = request.body;
        practiceProblem = AuditUtility.setNewProblemValues(practiceProblem);
        nonRequestOrderDetailValidation(PracticeProblem, practiceProblem)
            .then((vErrors) => {
                if (vErrors.length > 0) {
                    response.send(
                        next(
                            new CannotCreateOrderDetailException(
                                vErrors.map((error: ValidationError) => Object.values(error.constraints)).join(", ")
                            )
                        )
                    );
                } else {
                    const newProblem = this.practiceProblemRepository.create(practiceProblem);
                    this.practiceProblemRepository.save(newProblem)
                        .then((result: PracticeProblem) => {
                            response.send(result);
                        })
                        .catch((err) => {
                            next(new CannotCreateOrderDetailException(err));
                        });
                }
            });
    };

    private updateProblem = async (request: Request, response: Response, next: NextFunction) => {
        const data: PracticeProblem = request.body;
        const problemId = request.params.problemId;
        this.practiceProblemRepository.findOne(problemId)
            .then(async (result: PracticeProblem) => {
                if (result) {
                    result.problem = data.problem;
                    result.difficulty = data.difficulty;
                    result.where = data.where;
                    result.dateSolved = data.dateSolved;
                    result.isActive = data.isActive;
                    result.modifiedBy = data.modifiedBy || result.createdBy;
                    result.modifiedDatetime = new Date();
                    const updatedResult: PracticeProblem = await this.practiceProblemRepository.save(result);
                    updatedResult ? response.send(updatedResult) : next(new CompanyPriorityNotFoundException(problemId));
                } else {
                    next(new CompanyPriorityNotFoundException(problemId));
                }
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };
}

export default PracticeProblemController;