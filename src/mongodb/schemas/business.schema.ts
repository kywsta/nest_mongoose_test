import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type BusinessDocument = HydratedDocument<Business>;

@Schema()
export class BusinessMember {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, enum: ['owner', 'admin', 'employee'] })
  role: string;

  @Prop({ default: Date.now })
  joinedAt: Date;
}

export const BusinessMemberSchema = SchemaFactory.createForClass(BusinessMember);

@Schema()
export class BusinessSettings {
  @Prop({ default: 'UTC' })
  timezone: string;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ default: 'en' })
  language: string;
}

export const BusinessSettingsSchema = SchemaFactory.createForClass(BusinessSettings);

@Schema({ timestamps: true })
export class Business {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: BusinessSettingsSchema, default: () => ({}) })
  settings: BusinessSettings;

  @Prop({ type: [BusinessMemberSchema], default: [] })
  members: BusinessMember[];
}

export const BusinessSchema = SchemaFactory.createForClass(Business);

// Index for faster member lookups
BusinessSchema.index({ 'members.userId': 1 });

