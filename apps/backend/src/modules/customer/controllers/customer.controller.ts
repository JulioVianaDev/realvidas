import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
import {
  IGetAllCustomersResponse,
  IGetCustomerByIdResponse,
  ICreateCustomerResponse,
  IUpdateCustomerResponse,
  IDeleteCustomerResponse,
} from '@global-types/responses/customer.response';
import { CustomerService } from '../services/customer.service';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  GetCustomersDto,
} from '../dto/customer.dto';

@Controller({ path: 'customers', version: '1' })
@ApiTags('Customers')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getAll(
    @Query() params: GetCustomersDto,
  ): Promise<IGetAllCustomersResponse> {
    return this.customerService.getAll(params);
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
  ): Promise<IGetCustomerByIdResponse> {
    return this.customerService.getById(id);
  }

  @Post()
  async create(
    @Body() payload: CreateCustomerDto,
  ): Promise<ICreateCustomerResponse> {
    return this.customerService.create(payload);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateCustomerDto,
  ): Promise<IUpdateCustomerResponse> {
    return this.customerService.update(id, payload);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<IDeleteCustomerResponse> {
    return this.customerService.remove(id);
  }
}
