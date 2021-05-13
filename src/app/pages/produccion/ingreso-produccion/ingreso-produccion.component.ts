import { Component, OnInit } from '@angular/core';
import { AlertServiceService } from '../../../services/alert-service.service';
import { ArticuloService } from './../../../services/articulo.service';
import { MessageService, DialogService } from 'primeng/api';

import { ProduccionService } from './../../../services/produccion.service';


import { OverlayPanel } from 'primeng/overlaypanel';
import { Produccion } from 'src/app/models/produccion.model';
import { AsociarInsumoComponent } from '../popups/popup/asociar-insumo/asociar-insumo.component';
import { AsociarInsumoDetalleComponent } from './../popups/popup/asociar-insumo-detalle/asociar-insumo-detalle.component';
import { AsociarProduccionComponent } from './../popups/popup/asociar-produccion/asociar-produccion.component';
import { AsociarProduccionDetalleComponent } from './../popups/popup/asociar-produccion-detalle/asociar-produccion-detalle.component';
// tslint:disable-next-line: max-line-length
import { PopupCalculdorPalletsComponent } from '../../../shared/components/popups/popup-calculdor-pallets/popup-calculdor-pallets.component';
import { OrdenProduccion } from './../../../models/orden-produccion.model';
import { PopOrdenProduccionEditarComponent } from './../orden-produccion/pop-orden-produccion-editar/pop-orden-produccion-editar.component';
// tslint:disable-next-line: max-line-length
import { PopupOrdenProduccionDetalleConsultaComponent } from './popup-orden-produccion-detalle-consulta/popup-orden-produccion-detalle-consulta.component';
import { calendarioIdioma } from './../../../config/config';
import { formatDate } from '@angular/common';
import { Filter } from './../../../shared/filter';
import { PopupChartLineComponent } from '../../../shared/popups/popup-chart-line/popup-chart-line.component';

/* -------------------------------------------------------------------------- */
/*         AGREGAR UNA PRODUCCION REALIZADA A UNA ORDEN DE PRODUCCION         */
/* -------------------------------------------------------------------------- */


@Component({
  selector: 'app-ingreso-produccion',
  templateUrl: './ingreso-produccion.component.html',
  styleUrls: ['./ingreso-produccion.component.scss']
})
export class IngresoProduccionComponent implements OnInit {

  es: any;
  checked ;
  cols: any[];
  cols_produccion: any[];
  columns: any[];
  elementos: any[];
  elementos_produccion: any[];
  selectedElemento: any;
  selecteditems: any;
  loading;
  userData: any;
  fecha_desde: Date;
  fecha_hasta: Date;
  _fecha_desde: string;
  _fecha_hasta: string;
  _estado: any[] = [];
  constructor(private alertServiceService: AlertServiceService,
              private articuloService: ArticuloService,private produccionService: ProduccionService,
              public dialogService: DialogService, private messageService: MessageService, private filter: Filter) {

                this.cols = [
                  { field: 'id', header: 'Prod Nº',  width: '7.5%' },
                  { field: 'estado', header: 'Estado',  width: '8%' },
                  { field: 'fecha_creacion', header: 'Creado',  width: '10%' },
                  { field: 'descripcion', header: 'Descripción',  width: '30%' },
                  { field: 'observacion', header: 'Observación',  width: '25%' },
                  { field: 'fecha_desde', header: 'Inicio',  width: '12%' },
                  { field: 'fecha_hasta', header: 'Fin',  width: '12%' },
                  { field: 'nombreyapellido', header: 'Usuario',  width: '12%' },
                  { field: '', header: '',  width: '4%' },
                  { field: '', header: '',  width: '6%' },
                ];
               }

  ngOnInit() {
    this.es = calendarioIdioma  ;
    this.fecha_desde = new Date();
    this.fecha_hasta = new Date();
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.loadlist();
  }


  handleChange(e) {
    this.checked = e.checked;
    console.log(this.checked);
    if (this.checked) {
      this.loadlist();
    } else {
      this.loadlist();
    }
}


  loadlist() {

    this.loading = true;
    try {
        this.produccionService.getOrdenProduccionEstado('ACTIVO')
        .subscribe(resp => {
          if (resp[0]) {
            this.realizarFiltroBusqueda(resp);
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

  accion(event: any, overlaypanel: OverlayPanel, elementos: any) {
    if (elementos) {
      this.selectedElemento = elementos;
      console.log(elementos);
    }
    overlaypanel.toggle(event);
    }

    buscarProduccion(){
      this._fecha_desde = formatDate(new Date(this.fecha_desde), 'yyyy-MM-dd', 'en');
      this._fecha_hasta = formatDate(new Date(this.fecha_hasta), 'yyyy-MM-dd', 'en');

      this.loading = true;
      try {
          this.produccionService.getOrdenProduccionByDates('ACTIVO', this._fecha_desde, this._fecha_hasta)
          .subscribe(resp => {
            if (resp[0]) {
              this.realizarFiltroBusqueda(resp);
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


AsociarProduccion() {

  const data: any  =  this.selectedElemento;

  const ref = this.dialogService.open(AsociarProduccionComponent, {
  data,
   header: 'Asociar producción a orden de pedido',
   width: '98%',
   height: '90%'
  });
  ref.onClose.subscribe((AsociarProduccionComponent: any) => {

  });
}



AsociarProduccionDetalle() {

  const data: any = this.selectedElemento;

  const ref = this.dialogService.open(AsociarProduccionDetalleComponent, {
  data,
   header: 'Detalle producción a orden de pedido',
   width: '98%',
   height: '90%'
  });
  ref.onClose.subscribe((AsociarProduccionDetalleComponent:any) => {

  });
}

buscar(elemento: any) {
  console.log(elemento);
  let data: any;
  data = elemento;
  const ref = this.dialogService.open(PopupOrdenProduccionDetalleConsultaComponent, {
  data,
   header: 'Detalle de orden producción',
   width: '98%',
   height: '80%'
  });

  ref.onClose.subscribe((PopupOrdenProduccionDetalleConsultaComponent: any) => {
    if(PopupOrdenProduccionDetalleConsultaComponent){
      this.loadlist();
    }

  });

}

estadistica() {

    const data: any  =  this.elementos;
    const ref = this.dialogService.open(PopupChartLineComponent, {
    data,
     header: 'Gráfico de barras',
     width: '98%',
     height: '90%'
    });
    ref.onClose.subscribe((PopupChartLineComponent: any) => {

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

realizarFiltroBusqueda(resp: any[]){
  // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
  this._estado = [];

  resp.forEach(element => {
    this._estado.push(element['estado']);
  });

  // ELIMINO DUPLICADOS
  this._estado = this.filter.filterArray(this._estado);



}

}
