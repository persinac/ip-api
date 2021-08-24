import HttpException from "../HttpException";

class CannotFindOrderNotesWithOrderException extends HttpException {
    constructor(id: string) {
        super(404, `There are no order notes with order ID: ${id}`);
    }
}

export default CannotFindOrderNotesWithOrderException;