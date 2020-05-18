import { Component, OnInit } from '@angular/core';
import { MessageService, DialogService } from 'primeng/api';

import { CalidadService } from './../../../../services/calidad.service';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { PopupControlParametroComponent } from './popup-control-parametro/popup-control-parametro.component';

@Component({
  selector: 'app-calidad-control-parametro',
  templateUrl: './calidad-control-parametro.component.html',
  styleUrls: ['./calidad-control-parametro.component.scss']
})
export class CalidadControlParametroComponent implements OnInit {

  
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;

  constructor(private calidadService: CalidadService, private alertServiceService: AlertServiceService,  public dialogService: DialogService, private messageService: MessageService) { 

    this.cols = [

      { field: 'parametro', header: 'Parámetro',  width: '60%' },
      { field: 'estado', header: 'Estado',  width: '20%' },
      { field: '', header: 'Acción',  width: '20%' }

   ];
  }

  ngOnInit() {
    console.log('cargando insumo');
    this.loadlist();
  }

  loadlist(){

    this.loading = true;
    try {
        this.calidadService.getCalidadControlParametros()
        .subscribe(resp => {
          if (resp[0]) {
            this.elementos = resp;
            console.log(this.elementos);
              }else{
                this.elementos = null;
              }
            this.loading = false;
            console.log(resp);
        },
        error => { // error path
            console.log(error);

            this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
         });
    } catch (error) {
      this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
    }
}

buscar(elemento: any) {
  console.log(elemento);
  const data: any = elemento;

  const ref = this.dialogService.open(PopupControlParametroComponent, {
  data,
   header: 'Editar parametro de control de calidad',
   width: '60%',
   height: '50%'
  });

  ref.onClose.subscribe((PopupControlParametroComponent: any) => {

      this.loadlist();

  });

}


nuevo() {

  const data: any = null;

  const ref = this.dialogService.open(PopupControlParametroComponent, {
  data,
   header: 'Crear parametro de control de calidad',
   width: '60%',
   height: '50%'
  });

  ref.onClose.subscribe((PopupControlParametroComponent: any) => {

    if (PopupControlParametroComponent) {
      this.loadlist();
    }
  });

}
}

