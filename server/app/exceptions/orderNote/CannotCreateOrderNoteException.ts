import HttpException from "../HttpException";

class CannotCreateOrderNoteException extends HttpException {
    constructor(err: string) {
        super(404, `Cannot create order note! ${err}`);
    }
}

export default CannotCreateOrderNoteException;