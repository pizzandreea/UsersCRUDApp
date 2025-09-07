import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/users.dto';
import { UserRole } from '../../enums/user-role';
import { UserStatus } from '../../enums/user-status';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: []
})
export class HomeComponent implements OnInit {
  user: UserDto | null = null;
  UserRole = UserRole;
  UserStatus = UserStatus;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: data => this.user = data,
      error: () => console.error('Failed to load user')
    });
  }
}
