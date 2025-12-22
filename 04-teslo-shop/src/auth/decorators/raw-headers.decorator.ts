import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const RawHeaders = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const rHeaders = req.rawHeaders;

  if (!rHeaders) throw new InternalServerErrorException('No Raw Headers');

  return rHeaders;
});