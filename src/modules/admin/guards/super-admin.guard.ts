import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Foydalanuvchi topilmadi');
        }

        // Faqat SUPER_ADMIN
        if (user.role !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Super Admin huquqlari yo\'q');
        }

        return true;
    }
}
