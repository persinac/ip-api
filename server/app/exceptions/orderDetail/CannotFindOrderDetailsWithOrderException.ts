import HttpException from "../HttpException";

class CannotFindOrderDetailsWithOrderException extends HttpException {
    constructor(id: string) {
        super(404, `There are no order details with order ID: ${id}`);
    }
}

export default CannotFindOrderDetailsWithOrderException;