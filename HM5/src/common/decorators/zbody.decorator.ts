import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { z } from 'zod';

export const ZBody = (schema: z.ZodSchema) => createParamDecorator(
  async (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;

    try {
        return await schema.parseAsync(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.issues,
        });
      }
      throw new BadRequestException('Invalid request body');
    }
  },
)();