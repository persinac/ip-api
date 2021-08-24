import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";

async function nonRequestOrderDetailValidation<T>(type: any, data: any, skipMissingProperties = false): Promise<ValidationError[]> {
    return validate(plainToClass(type, data), { skipMissingProperties });
}

export default nonRequestOrderDetailValidation;