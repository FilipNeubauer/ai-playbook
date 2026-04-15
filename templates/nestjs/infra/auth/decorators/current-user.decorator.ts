import { createParamDecorator, type ExecutionContext } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import type { JwtPayload } from "../types/auth.types"

export const CurrentUser = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext): JwtPayload => {
		const contextType = ctx.getType<string>()

		if (contextType === "graphql") {
			return GqlExecutionContext.create(ctx).getContext().req.user as JwtPayload
		}

		return ctx.switchToHttp().getRequest().user as JwtPayload
	},
)
