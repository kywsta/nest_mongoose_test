import { IsString, IsIn, IsMongoId } from 'class-validator';
import { BusinessRole } from 'src/entities';

export class AddMemberDto {
  @IsString()
  @IsMongoId()
  userId: string;

  @IsString()
  @IsIn(['admin', 'employee', 'chatbot'])
  role: Exclude<BusinessRole, 'owner'>;
}
