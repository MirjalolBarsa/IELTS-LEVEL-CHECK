import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super();
    }

    async onModuleInit() {
        await this.$connect();
        console.log('🗄️  Database connected successfully');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        console.log('🗄️  Database disconnected');
    }

    async cleanDatabase() {
        if (process.env.NODE_ENV === 'production') return;

        const models = Reflect.ownKeys(this).filter(key => key[0] !== '_');

        return Promise.all(
            models.map((modelKey) => {
                const model = this[modelKey as string];
                return model?.deleteMany ? model.deleteMany() : Promise.resolve();
            })
        );
    }
}
