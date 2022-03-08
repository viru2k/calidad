import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  constructor() {}
  public warningAlert(
    textLine?: any,
    textMessage?: any,
    textFooter?: any,
    isShowCancel?: any
  ) {
    return swal({
      title: textLine || '',
      type: 'warning',
      text: textMessage || '',
      footer: textFooter || '',
      showCancelButton: isShowCancel,
      cancelButtonText: 'No',
      confirmButtonText: isShowCancel ? 'Yes' : 'Ok',
      reverseButtons: true,
      allowOutsideClick: false,
    });
  }

  public errorAlert(
    textLine?: any,
    textMessage?: any,
    textFooter?: any,
    isShowCancel?: any
  ) {
    return swal({
      title: textLine || 'Esta seguro?',
      text: textMessage || '',
      footer: textFooter || '',
      type: 'error',
      showCancelButton: isShowCancel,
      cancelButtonText: 'No',
      confirmButtonText: isShowCancel ? 'SI' : 'Ok',
      reverseButtons: true,
      allowOutsideClick: false,
    });
  }

  public successAlert(textLine?, textMessage?, textFooter?, isShowCancel?) {
    return swal({
      title: textLine || 'Esta seguro?',
      text: textMessage || '',
      footer: textFooter || '',
      type: 'success',
      showCancelButton: isShowCancel,
      cancelButtonText: 'No',
      confirmButtonText: isShowCancel ? 'SI' : 'Ok',
      reverseButtons: true,
      allowOutsideClick: false,
    });
  }
}
