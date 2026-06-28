import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";
import { Role } from 'src/infra/postgres-databases/main/entities/enums';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!requiredRoles) return true;

        const { user } = context.switchToHttp().getRequest();
        const hasAccess = requiredRoles.some((role) => user.role === role);

        if (!hasAccess) {
            throw new ForbiddenException("Acesso não autorizado");
        }

        return hasAccess;
    }
}
