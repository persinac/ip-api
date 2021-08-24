import HttpException from "../HttpException";

class NoteNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Order Note with id ${id} not found`);
    }
}

export default NoteNotFoundException;