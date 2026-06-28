import { Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';

/**
 * Manages tenant B2B customers ("Clientes"). The tenant-scoped
 * CUSTOMER_REPOSITORY is provided globally by PostgresDatabaseModule.
 */
@Module({
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
