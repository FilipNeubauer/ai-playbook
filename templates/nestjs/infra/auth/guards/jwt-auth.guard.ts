import { ExecutionContext, Injectable } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { AuthGuard } from "@nestjs/passport"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	getRequest(context: ExecutionContext) {
		const contextType = context.getType<string>()

		if (contextType === "graphql") {
			return GqlExecutionContext.create(context).getContext().req
		}

		return context.switchToHttp().getRequest()
	}
}
