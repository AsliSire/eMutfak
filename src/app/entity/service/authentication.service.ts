import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Employee } from '../model/employee';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUserSubject: BehaviorSubject<Employee>;
  currentUser: Observable<Employee>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Employee>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  get currentUserValue(): Employee {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string, password_control: string) {
    var employee = new Employee();
    employee.emp_username = username;
    employee.emp_password = password;
    employee.emp_password_control = password_control;
    return this.http.post(environment.api_url + '/auth/login', employee)
      .pipe(map(response => {
        console.log('employee >> ', response);
        localStorage.setItem('currentUser', JSON.stringify(response));
        localStorage.setItem('ExpirationDate', new Date().getDate().toString());
        //    if (response.token.token && response.jwt) {

        //     response.employee.token = response.jwt;

        //     console.log('user >> ', response.user);

        //     localStorage.setItem('currentUser', JSON.stringify(response.user));
        //     this.currentUserSubject.next(response.user);
        // }

        return response;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('ExpirationDate');
    this.currentUserSubject.next(null);
    //this.currentUserSubject.next(null);
    let url1 = window.location.origin + '/' + '';
    if (environment.base_url != '') url1 = window.location.origin + environment.base_url + '';
    console.log('URL1 = ' + url1);
    window.location.href = url1;
  }
}
