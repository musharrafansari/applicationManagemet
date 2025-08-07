import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    console.log('\x1b[32m%s\x1b[0m', '🟢 Database connected successfully');
  }
}
