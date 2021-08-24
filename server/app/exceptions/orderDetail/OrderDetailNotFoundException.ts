import HttpException from "../HttpException";

class OrderDetailNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Order Detail with id ${id} not found`);
    }
}

export default OrderDetailNotFoundException;