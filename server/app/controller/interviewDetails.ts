import { Request, Response, Router, NextFunction } from "express";
import { getRepository } from "typeorm";
import HttpException from "../exceptions/HttpException";
import CannotFindOrderDetailsWithOrderException
    from "../exceptions/orderDetail/CannotFindOrderDetailsWithOrderException";
import { InterviewDetail } from "../entities/InterviewDetail";
import OrderDetailNotFoundException from "../exceptions/orderDetail/OrderDetailNotFoundException";
import CannotCreateOrderDetailException from "../exceptions/orderDetail/CannotCreateOrderDetailException";
import nonRequestOrderDetailValidation from "../middleware/validations/nonRequestOrderDetailValidation";
import { ValidationError } from "class-validator";
import { AuditUtility } from "../middleware/objectUtilities/AuditUtility";
import { Interview } from "../entities/Interview";
import CompanyPriorityNotFoundException from "../exceptions/companyPriority/CompanyPriorityNotFoundException";

/***
 * TODO:
 *  - Update errors
 *
 * **/
class InterviewDetailsController {
    public path = "/interview/:id/detail";
    public router = Router();
    private interviewDetailRepository = getRepository(InterviewDetail);

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getInterviewDetailsByInterviewId);
        this.router.get(`${this.path}/:detailId`, this.getInterviewDetailById);
        this.router.post(this.path, this.createInterviewDetail);
        this.router.put(`${this.path}/:detailId`, this.updateInterviewDetail);
    }

    private getInterviewDetailById = (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        this.interviewDetailRepository.findOne(id)
            .then((result: InterviewDetail) => {
                result ? response.send(result) : next(new OrderDetailNotFoundException(id));
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    private getInterviewDetailsByInterviewId = (request: Request, response: Response, next: NextFunction) => {
        this.interviewDetailRepository.createQueryBuilder("d")
            .where(
                `d.interviewId = :interviewId`,
                {interviewId: request.params.id}
            )
            .getMany()
            .then((result: InterviewDetail[]) => {
                result.length > 0 ? response.send(result) : next(new CannotFindOrderDetailsWithOrderException(request.params.id));
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    private createInterviewDetail = (request: Request, response: Response, next: NextFunction) => {
        let interviewDetail: InterviewDetail = request.body;
        interviewDetail = AuditUtility.setNewInterviewDetailValues(interviewDetail);
        if (interviewDetail.interviewId === undefined) {
            next(new CannotCreateOrderDetailException("Missing Interview ID"));
        } else {
            nonRequestOrderDetailValidation(InterviewDetail, interviewDetail)
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
                        const newInterviewDetail = this.interviewDetailRepository.create(interviewDetail);
                        this.interviewDetailRepository.save(newInterviewDetail)
                            .then((result: InterviewDetail) => {
                                response.send(result);
                            })
                            .catch((err) => {
                                next(new CannotCreateOrderDetailException(err));
                            });
                    }
                });
        }
    };

    private updateInterviewDetail = async (request: Request, response: Response, next: NextFunction) => {
        const data: InterviewDetail = request.body;
        const detailId = request.params.detailId;
        this.interviewDetailRepository.findOne(detailId)
            .then(async (result: InterviewDetail) => {
                if (result) {
                    result.interviewDate = data.interviewDate;
                    result.interviewRound = data.interviewRound;
                    result.interviewer = data.interviewer;
                    result.interviewerRole = data.interviewerRole;
                    result.difficulty = data.difficulty;
                    result.question = data.question;
                    result.feedback = data.feedback;
                    result.outcome = data.outcome;
                    result.outcomeDate = data.outcomeDate;
                    result.decision = data.decision;
                    result.decisionDate = data.decisionDate;
                    result.isActive = data.isActive;
                    result.modifiedBy = data.modifiedBy || result.createdBy;
                    result.modifiedDatetime = new Date();
                    const updatedResult: InterviewDetail = await this.interviewDetailRepository.save(result);
                    updatedResult ? response.send(updatedResult) : next(new CompanyPriorityNotFoundException(detailId));
                } else {
                    next(new CompanyPriorityNotFoundException(detailId));
                }
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };
}

export default InterviewDetailsController;