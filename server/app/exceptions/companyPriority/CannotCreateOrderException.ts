import HttpException from "../HttpException";

class CannotCreateOrderException extends HttpException {
    constructor(err: string) {
        super(404, `Cannot create order! ${err}`);
    }
}

export default CannotCreateOrderException;