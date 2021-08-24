import HttpException from "../HttpException";

class CannotCreateOrderDetailException extends HttpException {
    constructor(err: string) {
        super(404, `Cannot create order detail! ${err}`);
    }
}

export default CannotCreateOrderDetailException;