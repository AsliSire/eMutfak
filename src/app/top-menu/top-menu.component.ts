import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../entity/service/authentication.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  isLogin : boolean = false;
  username: string;

  constructor(private authenticationService: AuthenticationService, private app: AppComponent) { 
    this.username = this.app.username;
  }

  ngOnInit() {
    if (this.authenticationService.currentUserValue) {
      this.isLogin = true;
    }
    else
    {
      this.isLogin = false;
    }
  }  
 
  logout() {
    this.authenticationService.logout();
  }

}
