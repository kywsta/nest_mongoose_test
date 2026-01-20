import { IsString, IsOptional, IsObject, MinLength, MaxLength } from 'class-validator';

export class BusinessSettingsDto  {
  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  language?: string;
}

export class CreateBusinessDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsObject()
  settings?: BusinessSettingsDto;
}
