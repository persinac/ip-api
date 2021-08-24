import { Request, Response, Router, NextFunction } from "express";
import { getRepository } from "typeorm";
import HttpException from "../exceptions/HttpException";
import nonRequestOrderDetailValidation from "../middleware/validations/nonRequestOrderDetailValidation";
import { ValidationError } from "class-validator";
import CannotCreateOrderDetailException from "../exceptions/orderDetail/CannotCreateOrderDetailException";
import CannotFindOrderDetailsWithOrderException
    from "../exceptions/orderDetail/CannotFindOrderDetailsWithOrderException";
import { Interview } from "../entities/Interview";
import { AuditUtility } from "../middleware/objectUtilities/AuditUtility";
import CompanyPriorityNotFoundException from "../exceptions/companyPriority/CompanyPriorityNotFoundException";

/***
 * TODO:
 *  - Update errors
 *
 * **/
class InterviewController {
    public path = "/interview";
    public router = Router();
    private interviewRepository = getRepository(Interview);

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getAllInterviews);
        this.router.get(`${this.path}/:id`, this.getInterviewById);
        this.router.post(this.path, this.createInterview);
        this.router.put(`${this.path}/:id`, this.updateInterview);
    }

    private getAllInterviews = (request: Request, response: Response, next: NextFunction) => {
        this.interviewRepository.find()
            .then((interviews: Interview[]) => {
                const iResponse: Interview[] = [];
                interviews.forEach((o: Interview) => {
                    iResponse.push(o);
                });
                iResponse.sort((a, b) => a.interviewId - b.interviewId);
                response.send(iResponse);
            });
    };

    private getInterviewById = (request: Request, response: Response, next: NextFunction) => {
        const interviewId = request.params.id;
        this.interviewRepository.createQueryBuilder("interview")
            .where({
                interviewId: interviewId
            })
            .getMany()
            .then((result: Interview[]) => {
                result.length > 0 ? response.send(result) : next(new CannotFindOrderDetailsWithOrderException(interviewId));
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    private createInterview = (request: Request, response: Response, next: NextFunction) => {
        let interview: Interview = request.body;
        interview = AuditUtility.setNewInterviewValues(interview);
        nonRequestOrderDetailValidation(Interview, interview)
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
                    const newInterview = this.interviewRepository.create(interview);
                    this.interviewRepository.save(newInterview)
                        .then((result: Interview) => {
                            response.send(result);
                        })
                        .catch((err) => {
                            next(new CannotCreateOrderDetailException(err));
                        });
                }
            });
    };

    private updateInterview = async (request: Request, response: Response, next: NextFunction) => {
        const data: Interview = request.body;
        const id = request.params.id;
        this.interviewRepository.findOne(id)
            .then(async (result: Interview) => {
                if (result) {
                    result.company = data.company;
                    result.appliedFrom = data.appliedFrom;
                    result.appliedOn = data.appliedOn;
                    result.role = data.role;
                    result.response = data.response;
                    result.referral = data.referral;
                    result.recruiterPOC = data.recruiterPOC;
                    result.outcome = data.outcome;
                    result.outcomeDate = data.outcomeDate;
                    result.isActive = data.isActive;
                    result.modifiedBy = data.modifiedBy || result.createdBy;
                    result.modifiedDatetime = new Date();
                    const updatedResult: Interview = await this.interviewRepository.save(result);
                    updatedResult ? response.send(updatedResult) : next(new CompanyPriorityNotFoundException(id));
                } else {
                    next(new CompanyPriorityNotFoundException(id));
                }
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    /* public methods? */
    /***
     * Better... but still not my favorite location
     *
     *  Can we plug this into a utility... maybe we'll create an actual class...
     ***/
    // public createOrderDetailWithNewOrder = async (companyPriority: Order, orderDetail: OrderDetail, currentIOResponse: IOrderResponse): Promise<IOrderResponse> => {
    //     orderDetail = OrderDetailUtility.setNewOrderDetailValues(companyPriority, orderDetail);
    //     const vErrors: ValidationError[] = await nonRequestOrderDetailValidation(OrderDetail, orderDetail);
    //     if (vErrors.length > 0) {
    //         // created an companyPriority but details has constraint issues
    //         currentIOResponse.error = vErrors.map((error: ValidationError) => Object.values(error.constraints)).join(", ");
    //     } else {
    //         orderDetail.totalPrice = OrderDetailUtility.getOrderDetailTotalPrice(orderDetail);
    //         const newOrderDetail = this.orderDetailRepository.create(orderDetail);
    //         try {
    //             const odResult: OrderDetail = await this.orderDetailRepository.save(newOrderDetail);
    //             currentIOResponse.orderDetails.push(odResult);
    //         } catch (e) {
    //             // created an companyPriority but details has field value issues
    //             currentIOResponse.error = `Order Detail: ${e.message}`;
    //         }
    //     }
    //     return currentIOResponse;
    // }
}

export default InterviewController;