import { NextFunction, Request, Response, Router } from "express";
import { CompanyPriority } from "../entities/CompanyPriority";
import { getRepository } from "typeorm";
import CompanyPriorityNotFoundException from "../exceptions/companyPriority/CompanyPriorityNotFoundException";
import HttpException from "../exceptions/HttpException";
import companyPriorityValidation from "../middleware/validations/companyPriorityValidation";
import ICompanyPriority from "../structure/ICompanyPriority";

class CompanyPriorityController {
    public path = "/company-priority";
    public router = Router();
    private cpRepository = getRepository(CompanyPriority);

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getCompanyPriorityList);
        this.router.get(`${this.path}/:id`, this.getCompanyPriorityById);
        this.router.post(this.path, companyPriorityValidation(CompanyPriority), this.createCompanyPriority);
        this.router.put(`${this.path}/:id`, companyPriorityValidation(CompanyPriority), this.updateCompanyPriority);
    }

    private getCompanyPriorityList = (request: Request, response: Response) => {
        this.cpRepository.find()
            .then((companyPriorities: CompanyPriority[]) => {
                const iResponse: ICompanyPriority[] = [];
                companyPriorities.forEach((o: CompanyPriority) => {
                    const { companyPriorityId, company, priority } = o;
                    const iCompPri: ICompanyPriority = { companyPriorityId, company, priority };
                    iResponse.push(iCompPri);
                });
                iResponse.sort((a, b) => a.priority - b.priority);
                response.send(iResponse);
            });
    };

    private getCompanyPriorityById = (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        this.cpRepository.findOne(id)
            .then((result: CompanyPriority) => {
                const iResponse: ICompanyPriority[] = [];
                const { companyPriorityId, company, priority } = result;
                const iCompPri: ICompanyPriority = { companyPriorityId, company, priority };
                iResponse.push(iCompPri);
                result ? response.send(iResponse) : next(new CompanyPriorityNotFoundException(id));
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    private createCompanyPriority = async (request: Request, response: Response) => {
        const cpData: CompanyPriority = request.body;
        const createdDatetime = new Date();
        const modifiedDatetime = new Date();
        cpData.modifiedDatetime = modifiedDatetime;
        cpData.createdDatetime = createdDatetime;
        const newCP = this.cpRepository.create(cpData);
        const result: CompanyPriority = await this.cpRepository.save(newCP);
        const { companyPriorityId, company, priority, createdBy, modifiedBy, isActive } = result;
        const iResponse: ICompanyPriority = { companyPriorityId, company, priority, createdDatetime, createdBy, modifiedDatetime, modifiedBy, isActive };
        response.send(iResponse);
    };

    private updateCompanyPriority = async (request: Request, response: Response, next: NextFunction) => {
        const cpData: CompanyPriority = request.body;
        const id = request.params.id;
        this.cpRepository.findOne(id)
            .then(async (result: CompanyPriority) => {
                if (result) {
                    result.company = cpData.company;
                    result.priority = cpData.priority;
                    result.isActive = cpData.isActive;
                    result.modifiedBy = cpData.modifiedBy || result.createdBy;
                    result.modifiedDatetime = new Date();
                    const updatedResult: CompanyPriority = await this.cpRepository.save(result);
                    updatedResult ? response.send(updatedResult) : next(new CompanyPriorityNotFoundException(id));
                } else {
                    next(new CompanyPriorityNotFoundException(id));
                }
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };
}

export default CompanyPriorityController;