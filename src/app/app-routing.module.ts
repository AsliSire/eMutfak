import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './entity/service/auth.guard';
import { LoginComponent } from './login';
import { LogoutComponent } from './logout/logout.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [    
  { path: '', component: HomeComponent,canActivate: [ AuthGuard ] },
  { path: 'home', component: HomeComponent,canActivate: [ AuthGuard ] },
  {path:'giris', component:LoginComponent},
  {path:'logout', component:LogoutComponent, canActivate: [ AuthGuard ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation:'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
