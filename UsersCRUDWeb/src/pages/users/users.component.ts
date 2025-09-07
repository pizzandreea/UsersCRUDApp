import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/users.dto';
import { UserStatus } from '../../enums/user-status';
import { UserRole } from '../../enums/user-role';
import { EditUserModalComponent } from '../../components/edit-user-modal/edit-user-modal.component';
import { UserCreateDto } from '../../dtos/create-user.dto';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, EditUserModalComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  @ViewChild(EditUserModalComponent) editModal!: EditUserModalComponent;
  users: UserDto[] = [];


  constructor(private userService: UserService) {
    this.loadUsers();
  }
  getRoleName(role: UserRole): string {
    return UserRole[role];
  }

  getStatusName(status: UserStatus): string {
    return UserStatus[status];
  }

  editUser(user: UserDto) {
    this.editModal.open(user);
  }

  onUserSaved(saved: UserDto | UserCreateDto) {
    if ('id' in saved && saved.id) {
      this.userService.update(saved.id, saved).subscribe(() => this.loadUsers());
    } else {
      console.log(saved)
      this.userService.create(saved as UserCreateDto).subscribe(() => this.loadUsers());
    }
  }


  loadUsers() {
    this.userService.getAll().subscribe(u => this.users = u);
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.delete(id).subscribe(() => this.loadUsers());
    }
  }

  addUser() {
    this.editModal.open();
  }

  trackByUserId(index: number, user: UserDto) {
    return user.id;
  }

}
