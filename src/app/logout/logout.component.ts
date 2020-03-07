import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    localStorage.removeItem('currentUser');
    let url1 = window.location.origin + '/' + 'giris';
    if (environment.base_url != '') url1 = window.location.origin + environment.base_url + 'giris';
    console.log('URL1 = ' + url1);
    window.location.href = url1;
  }
}
