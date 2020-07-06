import { Component, OnInit } from '@angular/core';
import { InsumoService } from '../../../services/insumo.service';
import { AlertServiceService } from '../../../services/alert-service.service';
import { DialogService } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';
import { PopUpInsumoStockComponent } from './popup-insumo-stock/popup-insumo-stock.component';

@Component({
  selector: 'app-insumo-stock',
  templateUrl: './insumo-stock.component.html',
  styleUrls: ['./insumo-stock.component.scss']
})
export class InsumoStockComponent implements OnInit {

  
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
      { field: 'descripcion', header: 'Descripción',  width: '30%' },
      { field: 'cantidad', header: 'Cantidad',  width: '12%' },
      { field: 'cantidad_usada', header: 'Usado',  width: '12%' },
      { field: 'cantidad_existente', header: 'Existencia',  width: '12%' },
      { field: '', header: '',  width: '6%' }
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
        this.insumoService.getStockExistencia()
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



detalle(elemento: any) {

  const data: any = elemento;
  const ref = this.dialogService.open(PopUpInsumoStockComponent, {
  data,
   header: 'Detalle del insumo',
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((PopUpInsumoStockComponent: any) => {
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
