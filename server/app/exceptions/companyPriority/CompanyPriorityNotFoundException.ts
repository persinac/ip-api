import HttpException from "../HttpException";

class CompanyPriorityNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Company Priority with id ${id} not found`);
    }
}

export default CompanyPriorityNotFoundException;