import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserDto } from '../../dtos/users.dto';
import { UserRole } from '../../enums/user-role';
import { UserStatus } from '../../enums/user-status';
import { UserCreateDto } from '../../dtos/create-user.dto';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})
export class EditUserModalComponent {
  @Input() user!: UserDto;
  @Output() saved = new EventEmitter<UserDto | UserCreateDto>();

  isOpen = false;
  editedUser!: UserDto | UserCreateDto;

  open(user?: UserDto) {
    if (user) {
      this.user = user;
      this.editedUser = { ...user };
    } else {
      this.user = undefined as any;
      this.editedUser = {
        fullName: '',
        email: '',
        userRole: UserRole.User,
        userStatus: UserStatus.Active,
        password: ''
      };
    }
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  save(form: NgForm) {
    if (!form.valid) {
      form.control.markAllAsTouched();
      return;
    }

    this.saved.emit(this.editedUser);
    this.close();
  }

  getRoleName(role: UserRole | undefined) {
    return role !== undefined ? UserRole[role] : '';
  }

  getStatusName(status: UserStatus | undefined) {
    return status !== undefined ? UserStatus[status] : '';
  }
}
