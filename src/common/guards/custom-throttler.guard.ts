import { Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
    protected async getTracker(req: Record<string, any>): Promise<string> {
        // IP address orqali tracking
        return req.ip || req.connection?.remoteAddress || 'unknown';
    }

    protected async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
        // Custom logic for rate limiting
        const { context, limit: originalLimit, ttl } = requestProps;
        const request = context.switchToHttp().getRequest();
        
        let limit = originalLimit;
        
        // Auth endpoint'lari uchun strict limit
        if (request.url.includes('/auth/')) {
            limit = Math.min(limit, 5); // Max 5 requests per minute for auth
        }

        return super.handleRequest({ ...requestProps, limit });
    }
}
