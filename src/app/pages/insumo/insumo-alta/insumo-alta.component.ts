import { Component, OnInit } from '@angular/core';
import { InsumoService } from '../../../services/insumo.service';
import { AlertServiceService } from '../../../services/alert-service.service';
import { MessageService, DialogService } from 'primeng/api';
import { PopupInsumoAltaComponent } from './popup-insumo-alta/popup-insumo-alta.component';


@Component({
  selector: 'app-insumo-alta',
  templateUrl: './insumo-alta.component.html',
  styleUrls: ['./insumo-alta.component.scss']
})
export class InsumoAltaComponent implements OnInit {

  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;
  estado: any[] = [];
  selectedEstado: string = 'ACTIVO' ;

  // tslint:disable-next-line: max-line-length
  constructor(private insumoService: InsumoService, private alertServiceService: AlertServiceService,  public dialogService: DialogService, private messageService: MessageService) {

    this.cols = [
      { field: 'nombre', header: 'Insumo',  width: '30%' },
      { field: 'comprobante', header: 'Comp. nª',  width: '18%' },
      { field: 'lote', header: 'Lote',  width: '16%' },
      { field: 'fecha_ingreso', header: 'Ingresado',  width: '18%' },
      { field: 'fecha_movimiento', header: 'Ultimo consumo',  width: '18%' },
      { field: 'cantidad', header: 'Cant. ingresada',  width: '12%' },
      { field: 'cantidad_usada', header: 'Usado',  width: '12%' },
      { field: 'cantidad_existente', header: 'Existencia',  width: '12%' }
   ];

   
    this.estado = [
    {name: 'ACTIVO',      value: 'ACTIVO'},
    {name: 'PAUSADO',     value: 'PAUSADO'},
    {name: 'FINALIZADO',  value: 'FINALIZADO'},
    {name: 'CANCELADO',   value: 'CANCELADO'}
    ];
  }



  ngOnInit() {
    console.log('cargando insumo');
    this.loadlist();
  }

  onChangeEstado(e) {
    console.log(e.target.value);
    this.selectedEstado = e.target.value;
    this.loadlist();
  }

  loadlist() {

    this.loading = true;
    try {
        this.insumoService.getStockInsumoByEstadoExistencia(this.selectedEstado, 'CON_EXISTENCIA')
        .subscribe(resp => {
          if (resp[0]) {
            this.elementos = resp;
            console.log(this.elementos);
              } else {
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


buscarExistente() {
  this.loading = true;
  try {
    this.insumoService.getStockInsumoByEstadoExistencia(this.selectedEstado, 'SIN_MOVIMIENTO')
    .subscribe(resp => {
      if (resp[0]) {
        this.elementos = resp;
        console.log(this.elementos);
          } else {
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

buscar() {

  let data: any;
  const ref = this.dialogService.open(PopupInsumoAltaComponent, {
  data,
   header: 'Editar insumo',
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((ArticuloEditarComponent: any) => {
        this.loadlist();
  });

}


colorRow(estado: string) {

  if (estado === 'ACTIVO') {
    return {'border-es-activo'  : 'null' };
  }
  if (estado === 'PAUSADO') {
    return {'border-es-pausado'  : 'null' };
  }
  if (estado === 'CANCELADO') {
    return {'border-es-cancelado'  : 'null' };
  }
  if (estado === 'FINALIZADO') {
    return {'border-es-finalizado'  : 'null' };
  }

  if (estado === 'NEUTRAL') {
    return {'border-es-neutral'  : 'null' };
  }
}

iconoColor(estado: string) {

  if (estado === 'ACTIVO') {
    return {'icono-success'  : 'null' };
  }
  if (estado === 'PAUSADO') {
    return {'icono-warning'  : 'null' };
  }
  if (estado === 'CANCELADO') {
    return {'icono-danger'  : 'null' };
  }
  if (estado === 'FINALIZADO') {
    return {'icono-secondary'  : 'null' };
  }
}

}
