import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdenProduccion } from './../../../models/orden-produccion.model';
import { OrdenProduccionDetalle } from './../../../models/orden-produccion-detalle.model';
import { AlertServiceService } from './../../../services/alert-service.service';
import { MessageService, DynamicDialogConfig, DialogService } from 'primeng/api';
import { ProduccionService } from './../../../services/produccion.service';
import { calendarioIdioma } from './../../../config/config';
import { OverlayPanel } from 'primeng/overlaypanel';
import { PopupAsociarProduccionComponent } from './../ingreso-produccion/popup-orden-produccion-detalle-consulta/popup-asociar-produccion/popup-asociar-produccion.component';
import { formatDate } from '@angular/common';
import { PopupCalidadParametroProduccionIngresoComponent } from './../../calidad/popup-calidad-parametro-produccion-ingreso/popup-calidad-parametro-produccion-ingreso.component';
import { element } from 'protractor';
import { Filter } from './../../../shared/filter';
import { ExporterService } from './../../../services/exporter.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-produccion-proceso',
  templateUrl: './produccion-proceso.component.html',
  styleUrls: ['./produccion-proceso.component.scss']
})
export class ProduccionProcesoComponent implements OnInit {

  
  editar;
  fecha_creacion: Date;
  _fecha_creacion: string;
  fecha_desde: Date;
  fecha_hasta: Date;
  _fecha_desde: string;
  _fecha_hasta: string;
  descripcion: string;
  obesrvacion: string;
  fecha: Date;
  es: any;
  cols: any[];
  columns: any[];
  elementos: OrdenProduccionDetalle[] = [];
  ordenProduccion: OrdenProduccion = null;
  selecteditems: any;
  loading;
  userData: any;
  estado: any[] = [];
  selectedEstado = 'ACTIVO' ;
  selectedItem: any;
  selectedEstados: string[] = [];
  elementosFiltrados: any[] = null;

  totalCantidad = 0;
  totalSolicitado = 0;

  _estado: any[] = [];
  _maquina_nombre: any[] = [];
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private alertServiceService: AlertServiceService, private produccionService: ProduccionService, public dialogService: DialogService,
               private messageService: MessageService, private exporterService: ExporterService,  private filter: Filter) {

    this.cols = [                  
      { field: 'orden_produccion_detalle_id', header: 'Prod Nº',  width: '7.5%' },
      { field: 'estado', header: 'Estado',  width: '12%' },
      { field: 'fecha_produccion', header: 'A producir el',  width: '18%' },
      { field: 'lote', header: 'Lote',  width: '18%' },
      { field: 'nombre', header: 'Producto',  width: '30%' },
      { field: 'maquina_nombre', header: 'Linea',  width: '18%' },
      { field: 'hora_inicio', header: 'Inicio',  width: '8%' },
      { field: 'hora_fin', header: 'Fin',  width: '8%' },
      { field: 'cantidad_solicitada', header: 'Solicitado',  width: '10%' },
      { field: '', header: 'En packs',  width: '10%' },
      { field: 'cantidad_producida', header: 'Realizado',  width: '10%' },
      { field: '', header: 'En packs',  width: '10%' },
      { field: '', header: '',  width: '6%' },
    ];

   }

  ngOnInit() {
    
    this.es = calendarioIdioma  ;
    this.fecha_creacion = new Date();
    this.fecha_desde = new Date();
    this.fecha_hasta = new Date();
    this.loadlist();
  }

  accion(evt: any, overlaypanel: OverlayPanel, event: any) {
    if (event) {
      this.selectedItem = event;
    }
    console.log(event);
    this.selectedItem = event;
    overlaypanel.toggle(evt);
  }

  

  
  onChangeEstado(e) {
    console.log(e.target.value);
    this.selectedEstado = e.target.value;
    this.loadlist();
  }

   loadlist() {
    console.log(this.selectedEstado);
    this.loading = true;
    try {
         this.produccionService.getProduccionProcesoByEstado(this.selectedEstado)
         .subscribe(resp => {
           if (resp[0]) {
            this.realizarFiltroBusqueda(resp);
            this.elementos = resp;
            this.sumarValores(this.elementos);
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


 buscarByDates() {
  console.log(this.selectedEstado);
  this._fecha_desde = formatDate(new Date(this.fecha_desde), 'yyyy-MM-dd HH:mm', 'en');
  this._fecha_hasta = formatDate(new Date(this.fecha_hasta), 'yyyy-MM-dd HH:mm', 'en');
  this.loading = true;
  try {
       this.produccionService.getProduccionProcesoByDates(this._fecha_desde, this._fecha_hasta)
       .subscribe(resp => {
         if (resp[0]) {
          this.realizarFiltroBusqueda(resp);
          this.elementos = resp;
          this.sumarValores(this.elementos);
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

 finalizarProduccion() {

  this.selectedItem.checked = true;
  this.selectedItem.checked_iniciado = false;
  const data: any = this.selectedItem;
  const ref = this.dialogService.open(PopupAsociarProduccionComponent, {
  data,
   header: 'Cambiar estado a una producción',
   width: '80%',
   height: '90%'
  });

  // tslint:disable-next-line: no-shadowed-variable
  ref.onClose.subscribe((PopupAsociarProduccionComponent: any) => {
      this.loadlist();
  });
}


 auditarProduccion() {
  const data: any = this.selectedItem;
  const ref = this.dialogService.open(PopupCalidadParametroProduccionIngresoComponent, {
  data,
   header: 'Cargar controles a producción',
   width: '98%',
   height: '90%'
  });


  // tslint:disable-next-line: no-shadowed-variable
  ref.onClose.subscribe((PopupCalidadParametroProduccionIngresoComponent: any) => {
    if (PopupCalidadParametroProduccionIngresoComponent) {
      this.loadlist();
    }

  });
}


stockProduccion() {
    
  const data: any = this.selectedItem;
  /* const ref = this.dialogService.open(UsuarioEditarComponent, {
  data,
   header: 'Editar usuario',
   width: '50%',
   height: '90%'
  });

  
  ref.onClose.subscribe((UsuarioEditarComponent: any) => {
    if (UsuarioEditarComponent) {
      this.loadlist();
    }

  }); */
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


sumarValores(vals: any) {
  let i: number;
  console.log(vals !== undefined);
  this.totalCantidad = 0;
  this.totalSolicitado = 0;

  for (i= 0; i < vals.length; i++) {
      this.totalSolicitado = this.totalSolicitado + Number(vals[i]['cantidad_solicitada']);
      this.totalCantidad = this.totalCantidad + Number(vals[i]['cantidad_producida']);

  }

}



filtered(event){
  console.log(event.filteredValue);
  this.elementosFiltrados  = event.filteredValue;
  this.sumarValores(this.elementosFiltrados);
}

exportarExcel() {
  const fecha = formatDate(new Date(), 'dd/MM/yyyy hh:mm', 'es-Ar');
  console.log(this.elementosFiltrados);
  if (this.elementosFiltrados == null) {
    this.elementosFiltrados = this.elementos;
  }
  this.exporterService.exportAsExcelFile(  this.elementosFiltrados, 'producciones_activas' );
}

exportarPdf() {}


onDateSelect(value) {
  this.table.filter(formatDate(value,'dd/MM/yyyy', 'es-Ar'), 'date', 'equals')
}


realizarFiltroBusqueda(resp: any[]){
  // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
  this._estado = [];
  this._maquina_nombre = [];

  resp.forEach(element => {
    this._estado.push(element.estado);
    this._maquina_nombre.push(element.maquina_nombre);
  });
  
  // ELIMINO DUPLICADOS
  this._estado = this.filter.filterArray(this._estado);
  this._maquina_nombre = this.filter.filterArray(this._maquina_nombre);
  


}


}


