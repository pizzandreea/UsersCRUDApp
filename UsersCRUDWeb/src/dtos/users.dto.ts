import { UserRole } from "../enums/user-role";
import { UserStatus } from "../enums/user-status";

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  userRole: UserRole;
  userStatus: UserStatus;
  createdAt: string;
  createdBy?: string;
  modifiedAt?: string;
  modifiedBy?: string;
  password?: string;
}
