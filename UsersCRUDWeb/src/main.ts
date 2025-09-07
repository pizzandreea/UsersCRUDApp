import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { JwtInterceptor } from './services/jwt.interceptor';
import { UsersComponent } from './pages/users/users.component';
import { adminGuard } from './guards/admin.guard';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'users', component: UsersComponent, canActivate: [adminGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(routes),
      FormsModule,
      CommonModule,
      HttpClientModule
    ),
    provideHttpClient(withInterceptors([JwtInterceptor])), provideAnimationsAsync()
  ]
}).catch(err => console.error(err));
