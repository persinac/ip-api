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
import { InterviewNote } from "../entities/InterviewNote";

/***
 * TODO:
 *  - Update errors
 *
 * **/
class InterviewNotesController {
    public path = "/interview/:id/detail/:detailId/note";
    public router = Router();
    private interviewNoteRepository = getRepository(InterviewNote);

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getInterviewNotesByInterviewDetailId);
        this.router.get(`${this.path}/:noteId`, this.getInterviewNoteById);
        this.router.post(this.path, this.createInterviewNote);
        this.router.put(`${this.path}/:noteId`, this.updateInterviewDetail);
    }

    private getInterviewNoteById = (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.noteId;
        this.interviewNoteRepository.findOne(id)
            .then((result: InterviewNote) => {
                result ? response.send(result) : next(new OrderDetailNotFoundException(id));
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    private getInterviewNotesByInterviewDetailId = (request: Request, response: Response, next: NextFunction) => {
        this.interviewNoteRepository.createQueryBuilder("n")
            .where(
                `n.interviewDetailId = :interviewDetailId`,
                {interviewDetailId: request.params.detailId}
            )
            .getMany()
            .then((result: InterviewNote[]) => {
                result.length > 0 ? response.send(result) : next(new CannotFindOrderDetailsWithOrderException(request.params.detailId));
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    private createInterviewNote = (request: Request, response: Response, next: NextFunction) => {
        let interviewNote: InterviewNote = request.body;
        interviewNote = AuditUtility.setNewInterviewNoteValues(interviewNote);
        if (interviewNote.interviewDetailId === undefined) {
            next(new CannotCreateOrderDetailException("Missing Interview Detail ID"));
        } else {
            nonRequestOrderDetailValidation(InterviewNote, interviewNote)
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
                        const newInterviewDetail = this.interviewNoteRepository.create(interviewNote);
                        this.interviewNoteRepository.save(newInterviewDetail)
                            .then((result: InterviewNote) => {
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
        const data: InterviewNote = request.body;
        const noteId = request.params.noteId;
        this.interviewNoteRepository.findOne(noteId)
            .then(async (result: InterviewNote) => {
                if (result) {
                    result.interviewerFeedback = data.interviewerFeedback;
                    result.selfFeedback = data.selfFeedback;
                    result.improveUpon = data.improveUpon;
                    result.isActive = data.isActive;
                    result.modifiedBy = data.modifiedBy || result.createdBy;
                    result.modifiedDatetime = new Date();
                    const updatedResult: InterviewNote = await this.interviewNoteRepository.save(result);
                    updatedResult ? response.send(updatedResult) : next(new CompanyPriorityNotFoundException(noteId));
                } else {
                    next(new CompanyPriorityNotFoundException(noteId));
                }
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };
}

export default InterviewNotesController;