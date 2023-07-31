import {Injectable} from '@nestjs/common';
import {PrismaClient} from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'DATABASE_URL="postgresql://postgres:123@localhost:5434/nest?schema=public"', // This will be replaced by env file variable later
        },
      },
    });
  }
}
