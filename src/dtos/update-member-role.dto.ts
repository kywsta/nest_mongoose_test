import { IsString, IsIn } from 'class-validator';
import { BusinessRole } from 'src/entities/business.entity';

export class UpdateMemberRoleDto {
  @IsString()
  @IsIn(['admin', 'employee', 'chatbot'])
  role: Exclude<BusinessRole, 'owner'>;
}
