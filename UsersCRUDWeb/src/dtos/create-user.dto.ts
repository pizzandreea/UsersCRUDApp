import { UserRole } from "../enums/user-role";
import { UserStatus } from "../enums/user-status";

export interface UserCreateDto {
  fullName: string;
  email: string;
  userRole: UserRole;
  userStatus: UserStatus;
  password: string;
}
