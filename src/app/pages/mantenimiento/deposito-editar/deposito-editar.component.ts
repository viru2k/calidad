import { Component, OnInit } from '@angular/core';
import { ProduccionService } from '../../../services/produccion.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { AlertServiceService } from './../../../services/alert-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-deposito-editar',
  templateUrl: './deposito-editar.component.html',
  styleUrls: ['./deposito-editar.component.scss']
})
export class DepositoEditarComponent implements OnInit {

  
  updateDataForm: FormGroup;
  elementos: any;
  unidades: any;
  unidad: string;
  es_nuevo;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;

  constructor(public config: DynamicDialogConfig, private produccionService: ProduccionService,
              private alertServiceService: AlertServiceService, public ref: DynamicDialogRef) {

    this.updateDataForm = new FormGroup({
      'id': new FormControl('', ),
      'descripcion': new FormControl('', Validators.required)
  });
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.config.data);
    if (this.config.data) {
      console.log('es editable');
      this.es_nuevo = false;
      this.updateDataForm.patchValue(this.config.data);
    }else{
      this.es_nuevo = true;
      console.log('es nuevo');
    }
  }




  guardarDatos() {

    if (this.es_nuevo) {
      this.nuevaDeposito();
    } else {
      this.editarDeposito();
    }
  }

  nuevaDeposito() {
    this.loading = true;
    try {
      this.produccionService.setDepositos(this.updateDataForm.value)
      .subscribe(resp => {
          this.loading = false;
          console.log(resp);
          this.ref.close(resp);
      },
      error => { // error path
        console.log(error);
        this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
     });
} catch (error) {
  this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
}
  }

  editarDeposito() {

    console.log(this.updateDataForm);
    try {
      this.produccionService.updDepositos( this.updateDataForm.value.id, this.updateDataForm.value)
      .subscribe(resp => {
        this.loading = false;
        console.log(resp);
        this.ref.close(resp);
      },
      error => { // error path
        console.log(error);
        this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
     });
} catch (error) {
  this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
}
  }

}

