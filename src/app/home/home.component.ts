import { Component, OnInit, Inject, HostListener } from '@angular/core';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { ApiService } from '../entity/service/api.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '../entity/service/authentication.service';
import { AppComponent } from '../app.component';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Product } from '../entity/model/product';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ModalComponent } from '../modal/modal.component';
declare var $: any;
const now = Date.now();

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  start: number;
  length: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dtOptions: any = {};
  dtTrigger: Subject<HomeComponent> = new Subject();
  Subscription: any;
  tarih: string;
  windowScrolled: boolean;
  product: any;
  edit_ref_no: any;  
  isLogin: boolean = false;

  constructor(
    private service: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private app: AppComponent, 
    @Inject(DOCUMENT)
    private document: Document,
    private http: HttpClient,
    public matDialog: MatDialog) {
      if (this.authenticationService.currentUserValue) {
        this.isLogin = true;
      }
      else {
        this.isLogin = false;
      }
  
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.Subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
    this.tarih = this.app.formatDate(now);
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    }
    else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
  }
  scrollToTop() {
    (function smoothscroll() {
      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }
    })();
  }


  ngOnInit() {
    this.dtOptions = {
      //pagination: true,
      pagingType: 'first_last_numbers',
      retrieve: true,
      responsive: true,
      pageLength: 25,
      dom: 'Brtp',
      order: false,
    };   
    
    this.GetProduct();
  }

  GetProduct() {
    this.service.GetProduct().subscribe(data => {
      this.product = data;
    });
  }
 
  EditProduct(rec_id) {
    localStorage.setItem("editId", rec_id);
    this.openModal()
  }

  DeleteProduct(rec_id) {
    this.service.DeleteProduct(rec_id).subscribe(data => {
      if (data == 'Kayıt Başarıyla Silindi') {
        const Toast = Swal.mixin({
          toast: true,
          showConfirmButton: false,
        });
        Toast.fire({
          position: 'center',
          title: 'Kayıt Silindi',
          icon: 'warning',
          timer: 1500
        });
        this.GetProduct();
        this.dtTrigger.unsubscribe();
      }
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    if (this.Subscription) {
      this.Subscription.unsubscribe();
    }
    this.dtTrigger.unsubscribe();
  }

 openModal() {
  const dialogConfig = new MatDialogConfig();
  // The user can't close the dialog by clicking outside its body
  dialogConfig.disableClose = true;
  dialogConfig.id = "modal-component";
  dialogConfig.height = "350px";
  dialogConfig.width = "600px";
  // https://material.angular.io/components/dialog/overview
  const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
}


}
