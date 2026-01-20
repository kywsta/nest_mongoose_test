import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { AddMemberDto, UpdateMemberRoleDto } from 'src/dtos';
import { CreateBusinessDto } from 'src/dtos/create-business.dto';
import { Business } from 'src/entities';
import { BusinessService } from 'src/services/business/business.service';

@Controller('business')
export class BusinessController {
  constructor(private businessService: BusinessService) {}

  @Get()
  async getBusinesses(): Promise<Business[]> {
    return this.businessService.getBusinesses();
  }

  @Post()
  async create(@Body() dto: CreateBusinessDto): Promise<Business> {
    return this.businessService.createBusiness({
      name: dto.name,
      description: dto.description,
      settings: {
        timezone: dto.settings?.timezone ?? 'UTC',
        currency: dto.settings?.currency ?? 'USD',
        language: dto.settings?.language ?? 'en',
      },
    });
  }

  @Post(':id/members')
  async addMember(
    @Param('id') id: string,
    @Body() dto: AddMemberDto,
  ): Promise<Business> {
    return this.businessService.addMember(id, dto.userId, dto.role);
  }

  @Put(':id/members/:memberId')
  async updateMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberRoleDto,
  ): Promise<Business> {
    return this.businessService.updateMemberRole(id, memberId, dto.role);
  }
}
