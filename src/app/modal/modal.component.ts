import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from '../entity/model/product';
import { ApiService } from '../entity/service/api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AppComponent } from '../app.component';
import { AuthenticationService } from '../entity/service/authentication.service';
declare var $: any;
const now = Date.now();

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  edit_ref_no: any;
  editId: any;
  calculatedValue: any;
  isLogin: boolean = false;
  get controls(): FormGroup["controls"] {
    return this.fg_product.controls;
  }

  fg_product = new FormGroup({
    rec_tck_no : new FormControl('',Validators.required),
    rec_name_surname: new FormControl('',Validators.required),
    prd_price: new FormControl('',Validators.required),
    prd_currency_unit: new FormControl('',Validators.required),
    prd_calculated_value: new FormControl('',Validators.required),
  })

  constructor(public dialogRef: MatDialogRef<ModalComponent>, private service:ApiService, private authenticationService: AuthenticationService) {
    if (this.authenticationService.currentUserValue) {
      this.isLogin = true;
    }
    else {
      this.isLogin = false;
    }
   }
  ngOnInit() {
    this.editId = localStorage.getItem("editId");
    this.fg_product.patchValue({
      prd_currency_unit: "1"
    })

    if(this.editId)
    {
      if (this.editId != "0") {
        this.service.ProductDetail(this.editId).subscribe(
          data => {
            var rec_tck_no = data[0]['rec_tck_no'];
            var rec_name_surname = data[0]['rec_name_surname'];
            var prd_price = data[0]['prd_price'];
            var prd_currency_unit = data[0]['prd_currency_unit'];
            var prd_calculated_value = data[0]['prd_calculated_value'];
                  
            this.fg_product.patchValue({
              rec_tck_no: rec_tck_no,
              rec_name_surname: rec_name_surname,
              prd_price: prd_price,
              prd_currency_unit: prd_currency_unit,
              prd_calculated_value: prd_calculated_value
          
            })
          }
        )
      }
    }
            //#region TC KİMLİK NUMARASI GEÇERLİLİK KONTROLÜ
            $(document).ready(function () {
              var checkTcNum = function (value) {
                value = value.toString();
                var isEleven = /^[0-9]{11}$/.test(value);
                var totalX = 0;
                for (var i = 0; i < 10; i++) {
                  totalX += Number(value.substr(i, 1));
                }
                var isRuleX = totalX % 10 == value.substr(10, 1);
                var totalY1 = 0;
                var totalY2 = 0;
                for (var i = 0; i < 10; i += 2) {
                  totalY1 += Number(value.substr(i, 1));
                }
                for (var i = 1; i < 10; i += 2) {
                  totalY2 += Number(value.substr(i, 1));
                }
                var isRuleY = ((totalY1 * 7) - totalY2) % 10 == value.substr(9, 0);
                return isEleven && isRuleX && isRuleY;
              };
        
              $('#rec_tck_no').on('keyup focus blur load', function (event) {
                event.preventDefault();
                this.isValid = checkTcNum($(this).val());
                if (this.isValid) {
                  $('#rec_tck_no').attr('class', 'input-sm form-control thresold-i');
                }
                else {
                  $('#rec_tck_no').attr('class', 'input-sm form-control thresold-i invalid');
                }
              });
            });
            //#endregion TC KİMLİK NUMARASI GEÇERLİLİK KONTROLÜ    
  }
  
  SaveProduct() {
    const product = new Product();
    if (this.editId) { product.Id = this.editId; } //bir kayıt yapıldığı anlamına geliyor.

    product.rec_tck_no = this.controls.rec_tck_no.value;
    product.rec_name_surname = this.controls.rec_name_surname.value;
    product.prd_price = this.controls.prd_price.value;
    product.prd_currency_unit = this.controls.prd_currency_unit.value;
    product.prd_calculated_value = this.controls.prd_calculated_value.value;

    /* 
    product.prd_code = this.controls.prd_code.value;
    product.prd_name = this.controls.prd_name.value;
    product.prd_stock = this.controls.prd_stock.value;
    product.prd_price = this.controls.prd_price.value;

 */

this.service.SaveProduct(product).subscribe(data => {
  if (data == 'ok') {
    console.log('Kayıt Başarılı');
    const Toast = Swal.mixin({
      toast: true,
      showConfirmButton: false,
    });
    Toast.fire({
      position: 'center',
      title: 'Kayıt Başarılı',
      icon: 'success',
      timer: 1500
    });
    this.closeModal();
    this.fg_product.patchValue({
      prd_currency_unit: "1"
    })   
    let url1 = window.location.origin + '/' + 'home';
    if (environment.base_url != '') url1 = window.location.origin + environment.base_url + 'home';
    console.log('URL1 = ' + url1);
    window.location.href = url1;
      }
}, error => {
  Swal.fire(
    'Kayıt Başarısız',
    error.error,
    'error')
});
}

  actionFunction() {
    alert("You have logged out.");
    this.closeModal();
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  closeModal() {
    this.dialogRef.close();
    localStorage.removeItem("editId");
  }

  Hesaplama(prd_price: number,unit){
    if(unit == 1){
      this.calculatedValue = (prd_price*(1.0)).toFixed(2);
    }
    if(unit == 2){
      this.calculatedValue = (prd_price*(6.10)).toFixed(2);
    }
    if(unit == 3){
      this.calculatedValue = (prd_price*(6.91)).toFixed(2);
    }
    console.log(unit);
    console.log(prd_price);
    console.log(this.calculatedValue);

    this.fg_product.patchValue({
      prd_calculated_value: this.calculatedValue
    })
  }

  format(value){
    let str = String(value);
    let comma = ',';
    let newValue = str.replace(comma , '.');
    if(!(str.includes(","))&&!(str.includes(".")))
    {
      newValue = str +".00";
    this.fg_product.patchValue({
      prd_price : newValue
    })
  }
  console.log(newValue);
    return newValue;  
  }
}
