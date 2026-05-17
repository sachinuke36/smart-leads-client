import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map(err => {
      if ('path' in err) {
        return { [err.path]: err.msg };
      }
      return { error: err.msg };
    });

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: extractedErrors
    });
  };
};
