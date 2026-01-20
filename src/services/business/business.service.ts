import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Business,
  BusinessDocument,
  BusinessSettings,
} from 'src/mongodb/schemas/business.schema';
import {
  Business as BusinessEntity,
  BusinessSettings as BusinessSettingsEntity,
  BusinessMember as BusinessMemberEntity,
} from 'src/entities/business.entity';

export type BusinessRole = 'owner' | 'admin' | 'employee' | 'chatbot';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
  ) { }

  async getBusinesses(): Promise<BusinessEntity[]> {
    const businesses = await this.businessModel.find().exec();
    return businesses.map((business) => this.toEntity(business));
  }

  async createBusiness(data: Partial<BusinessEntity>): Promise<BusinessEntity> {
    const business = new this.businessModel({
      name: data.name,
      description: data.description,
      settings: {
        timezone: data.settings?.timezone || 'UTC',
        currency: data.settings?.currency || 'USD',
        language: data.settings?.language || 'en',
      },
      members: [],
    });

    business.validate();

    const savedBusiness = await business.save();
    return this.toEntity(savedBusiness);
  }

  async addMember(
    businessId: string,
    userId: string,
    role: BusinessRole,
  ): Promise<BusinessEntity> {
    if (
      !Types.ObjectId.isValid(businessId) ||
      !Types.ObjectId.isValid(userId)
    ) {
      throw new BadRequestException('Invalid business or user ID');
    }

    const business = await this.businessModel
      .findByIdAndUpdate(
        businessId,
        {
          $push: {
            members: {
              userId: new Types.ObjectId(userId),
              role,
              joinedAt: new Date(),
            },
          },
        },
        { new: true },
      )
      .exec();

    if (!business) {
      throw new BadRequestException('Business not found');
    }

    return this.toEntity(business);
  }

  async updateMemberRole(
    businessId: string,
    userId: string,
    role: BusinessRole,
  ): Promise<BusinessEntity> {
    if (
      !Types.ObjectId.isValid(businessId) ||
      !Types.ObjectId.isValid(userId)
    ) {
      throw new BadRequestException('Invalid business or user ID');
    }



    try {
      // Using findOneAndUpdate
      const business = await this.businessModel
        .findOneAndUpdate(
          {
            _id: businessId,
            members: { $elemMatch: { userId: userId } },
          },
          {
            $set: { 'members.$.role': role },
          }
        , { new: true })
        .exec();

      if (!business) {
        throw new BadRequestException('Business not found');
      }

      return this.toEntity(business);
    } catch (error) {
      throw new BadRequestException('Failed to update member role');
    }
  }

  private toEntity(document: BusinessDocument): BusinessEntity {
    const members: BusinessMemberEntity[] = document.members.map((m) => ({
      userId: m.userId.toString(),
      role: m.role as BusinessRole,
      joinedAt: m.joinedAt,
    }));

    const settings: BusinessSettingsEntity = {
      timezone: document.settings?.timezone || 'UTC',
      currency: document.settings?.currency || 'USD',
      language: document.settings?.language || 'en',
    };

    return new BusinessEntity({
      id: document._id.toString(),
      name: document.name,
      description: document.description,
      settings,
      members,
      createdAt: (document as any).createdAt,
      updatedAt: (document as any).updatedAt,
    });
  }
}
