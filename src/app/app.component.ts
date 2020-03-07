import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from './entity/service/authentication.service';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import 'hammerjs';
// the second parameter 'fr' is optional
registerLocaleData(localeTr, 'tr');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'eMutfak';
  isLogin: boolean = false;
  username: string;
  sicil_no: number;
  hour: string;
  user_id: number;
  user_kod: string;
  user_yetki: string;

  constructor(private authenticationService: AuthenticationService) {
    if(localStorage.getItem("currentUser")) this.checkExpiration();
    if (this.authenticationService.currentUserValue) {
      this.isLogin = true;
       this.username = String(this.authenticationService.currentUserSubject.value.emp_username).toUpperCase();
    }
    else {
      this.isLogin = false;
    }
  }

  public formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    let hour = d.getHours();
    let minutes = d.getMinutes().toString();
    if (minutes.length < 2) minutes = '0' + minutes;
    this.hour = hour + ':' + minutes;
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  FloatParse(value: any): Number{
    let str = String(value);
    let comma = ',';
    let newValue = str.replace(comma , '.');

    return Number(newValue);
  }

  checkExpiration() {
    var expiration = localStorage.getItem("ExpirationDate")
    //login yapılan tarihteki gün ile aynı olup olmadığı karşılaştırılır, aynı değilse logout() çağırılır.
    if (expiration != new Date().getDate().toString()) {
      this.authenticationService.logout();
    }
  }
}
