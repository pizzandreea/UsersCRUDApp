import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '../dtos/users.dto';
import { Observable } from 'rxjs';
import { UserCreateDto } from '../dtos/create-user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:44321/api/Users';
  private tokenKey = 'jwtToken';

  constructor(private http: HttpClient) {}

  public getMe(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/me`);
  }

  getAll(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl, { headers: this.authHeaders() });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.authHeaders() });
  }

  update(id: string, user: Partial<UserDto>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, user, { headers: this.authHeaders() });
  }

  create(user: UserCreateDto): Observable<UserDto> {
    return this.http.post<any>(this.apiUrl, user, { headers: this.authHeaders() });
  }


  private authHeaders() {
    return { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` };
  }

}
