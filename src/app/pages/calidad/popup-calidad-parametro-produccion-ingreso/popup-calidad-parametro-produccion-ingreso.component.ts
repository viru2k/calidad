import { Component, OnInit } from '@angular/core';
import { AlertServiceService } from './../../../services/alert-service.service';
import { DialogService, MessageService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { ProduccionService } from '../../../services/produccion.service';
import { CalidadService } from '../../../services/calidad.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { calendarioIdioma } from '../../../config/config';
import { formatDate } from '@angular/common';
import { ControCalidadParametroValor } from '../../../models/control-calidad-parametro-valor.model';


@Component({
  selector: 'app-popup-calidad-parametro-produccion-ingreso',
  templateUrl: './popup-calidad-parametro-produccion-ingreso.component.html',
  styleUrls: ['./popup-calidad-parametro-produccion-ingreso.component.scss']
})
export class PopupCalidadParametroProduccionIngresoComponent implements OnInit {


  fecha_desde: Date;
  fecha_hasta: Date;
  _fecha_desde: string;
  _fecha_hasta: string;
  procesoProduccionId: string;
  elemento: any = null;
  elementos: ControCalidadParametroValor[];
  elementosControl: ControCalidadParametroValor[];
  userData: any;
  loading;
  selected: any;
  selectedElemento: any;
  cols: any;
  display;
  valorObtenido = 0;
  estadoNoConformidad;
  noConformidad: string;
  accionCorrectiva: string;
  estadoAccionCorrectiva;
  hora: Date;
  fecha: Date;
  es: any;
  elementoFinal: ControCalidadParametroValor[] = [];
  data: any;
  tieneEstadistica;
  constructor(private alertServiceService: AlertServiceService, private produccionService: ProduccionService,
     private calidadService: CalidadService, public dialogService: DialogService,
      private messageService: MessageService, private config: DynamicDialogConfig, public ref: DynamicDialogRef) {

    this.cols = [
      { field: 'parametro', header: 'Parámetro',  width: '35%' },
      { field: 'calidad_valor', header: 'Valor',  width: '12%' },
      { field: 'es_no_conformidad_descripcion', header: 'No conformidad',  width: '30%' },
      { field: 'tiene_accion_correctiva_descripcion', header: 'Acción correctiva',  width: '30%' },
      { field: '', header: '',  width: '8%' },
    ];

  }


  ngOnInit() {
    this.data = this.config.data;
    this.procesoProduccionId = this.config.data.id;
    this.es = calendarioIdioma;
    this.hora = new Date();
    this.fecha = new Date();
    console.log(this.config.data);
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.getCalidadControlEncabezado(this.config.data['id']);
    this.getControlByProcesoId();

    
  }


  onChangeControl(e: any) {
    console.log(e.target.value);
    this.getCalidadControlParametroControl();

  }

  confirmarParametro() {
    this.display = false;
    this.elemento.calidad_valor = this.valorObtenido;
    this.elemento.tiene_accion_correctiva_descripcion = this.accionCorrectiva;
    this.elemento.es_no_conformidad_descripcion =  this.noConformidad;
    if (this.estadoNoConformidad) {
      this.elemento.no_conformidad =  'SI';
    } else {
      this.elemento.no_conformidad =  'NO';
      this.elemento.es_no_conformidad_descripcion = '';
    }

    if (this.estadoAccionCorrectiva) {
      this.elemento.es_accion_correctiva = 'SI';
    } else {
      this.elemento.es_accion_correctiva = 'NO';
      this.elemento.tiene_accion_correctiva_descripcion = '';
    }
    // VALIDO SI ESTA ENTRE LOS PARAMETROS, SI NO ESTA LE COLOCO UNO PARA PODER SUMAR Y CUANTIFICAR LUEGO
    if ((this.elemento.parametro_minimo <= this.valorObtenido) && (this.elemento.parametro_maximo >= this.valorObtenido)) {
      this.elemento.tiene_desviacion_parametro = 0;
    } else {
      this.elemento.tiene_desviacion_parametro = 1;
    }
    this.estadoAccionCorrectiva = false;
    this.accionCorrectiva = '';
    this.estadoNoConformidad = false;
    this.noConformidad = '';
    this.valorObtenido = 0;
    console.log(this.elemento);
  }

  guardarControl() {
    let i = 0;
    console.log(this.elementos);
    this.elementos.forEach(ele => {
      console.log(ele);
      if (this.elementos[i]['calidad_valor']) {
        const fecha = formatDate(new Date(this.fecha), 'yyyy-MM-dd', 'en') + ' ' +  formatDate(new Date(this.hora), 'HH:mm:ss', 'en') ;
        this.elementos[i]['fecha'] = fecha;
        this.elementos[i]['produccion_proceso_id']  = this.procesoProduccionId;
        this.elementos[i]['usuario_modifica_id'] = this.config.data.id;
        this.elementoFinal.push (this.elementos[i]);
        i++;
     //   console.log(fecha);
      }
    }
      );
    console.log(this.elementoFinal);
    this.loading = true;
    try {
           this.calidadService.setCalidadControlParametrosValor(this.elementoFinal)
           .subscribe(resp => {
            
             this.loading = false;
             console.log(resp);
             this.alertServiceService.throwAlert('success',  'Control generado correctamente', '', '200');
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

  changeNoConformidad(event) {
    console.log(event);
  }

  changeAccionCorrectiva(event) {
    console.log(event);
  }

  accion(evt: any, event: any) {
    if (event) {
     // this.selectedElemento = event;
    }
    console.log(event);
    this.elemento = event;
    this.display = true;
  }


  getCalidadControlEncabezado(produccion: any) {
    console.log(produccion);
    this.loading = true;
    try {
         this.calidadService.getCalidadControlEncabezado()
         .subscribe(resp => {
           if (resp[0]) {
             this.elementosControl = resp;
             console.log(this.elementosControl);
               } else {
                 this.elementosControl = null;
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

 

 getCalidadControlParametroControl() {

  console.log(this.selected);
  this.loading = true;
  try {
       this.calidadService.getCalidadControlParametroControl(this.selected.id)
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



getControlByProcesoId() {

  console.log(this.data.produccion_proceso_id);
  this.loading = true;
  try {
       this.calidadService.getControlByProcesoId(this.data.produccion_proceso_id)
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




 estadistica(elemento: any) {

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
