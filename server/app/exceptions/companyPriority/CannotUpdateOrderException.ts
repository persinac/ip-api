import HttpException from "../HttpException";

class CannotUpdateOrderException extends HttpException {
    constructor(err: string) {
        super(404, `Cannot update order! ${err}`);
    }
}

export default CannotUpdateOrderException;