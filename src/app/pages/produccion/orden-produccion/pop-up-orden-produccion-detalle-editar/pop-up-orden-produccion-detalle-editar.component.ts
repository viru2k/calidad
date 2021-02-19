import { Component, OnInit } from '@angular/core';
import { calendarioIdioma } from './../../../../config/config';
import { DynamicDialogRef, MessageService, DialogService, DynamicDialogConfig } from 'primeng/api';
import { ArticuloService } from './../../../../services/articulo.service';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { PopupCalculdorPalletsComponent } from './../../../../shared/components/popups/popup-calculdor-pallets/popup-calculdor-pallets.component';
import { SectorService } from '../../../../services/sector.service';
import { formatDate } from '@angular/common';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-pop-up-orden-produccion-detalle-editar',
  templateUrl: './pop-up-orden-produccion-detalle-editar.component.html',
  styleUrls: ['./pop-up-orden-produccion-detalle-editar.component.scss'],
  providers: [DialogService]
})
export class PopUpOrdenProduccionDetalleEditarComponent implements OnInit {

  selectedRow:any;
  fecha_produccion: Date;
  hora_produccion: Date;
  hora_produccion_minutos = 0;
  es: any;
  cols: any[];
  columns: any[];
  elementos: any[] = [];
  grupos: any[];
  selecteditems: any;
  loading;
  userData: any;
  cantidad = 0;
  selected: any;
  display;
  displayEstado;
  position: string;
  volumen: number;
  index: number;

  // tslint:disable-next-line: max-line-length
  constructor(private alertServiceService: AlertServiceService, public dialogService: DialogService, private messageService: MessageService, private articuloService: ArticuloService, public sectorService: SectorService, public ref: DynamicDialogRef,  private config: DynamicDialogConfig) {
    this.cols = [
      { field: 'nombre', header: 'Articulo',  width: '30%' },
      { field: 'fecha_produccion', header: 'Fecha producción',  width: '12%' },
      { field: 'horas', header: 'Horas',  width: '10%' },
      { field: 'grupo_nombre', header: 'Grupo',  width: '15%' },
      { field: 'unidades', header: 'Unidades',  width: '8%' },
      { field: 'pallet_pisos', header: 'Pisos',  width: '8%' },
      { field: 'pallet_pack', header: 'Pack',  width: '8%' },
      { field: 'unidad_hora', header: 'U/h',  width: '8%' },
      { field: 'cantidad', header: 'Cantidad',  width: '10%' },
      { field: 'packs', header: 'Packs',  width: '10%' },
      { field: '', header: '',  width: '6%' }

   ];
  }


  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.es = calendarioIdioma  ;
    this.fecha_produccion = new Date();
    this.hora_produccion = new Date(this.fecha_produccion.getFullYear(), this.fecha_produccion.getMonth(), this.fecha_produccion.getDate(), 8, 0, 0);
    this.loadlist();
    this.loadGrupo();
  }

  actualizarFecha(event) {
    console.log(event);
    this.fecha_produccion = event;
    console.log(new Date(this.fecha_produccion));
  }

  onChangeGrupo() {
    //console.log(e.target.value);
    console.log(this.selected);
  }


  showDialog(position: string) {

}

  loadlist() {

    this.loading = true;
    try {
        this.articuloService.getArticulo()
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



  loadGrupo() {

    this.loading = true;
    try {
        this.sectorService.getGrupo()
        .subscribe(resp => {
          if (resp[0]) {
            this.grupos = resp;
            console.log(this.grupos);
            this.selected = this.grupos ['0'];
              } else {
                this.grupos = null;
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



calcular() {

  const data: any = this.selectedRow;
  const ref1 = this.dialogService.open(PopupCalculdorPalletsComponent, {
  data,
   header: 'Calcular cantidad',
   width: '98%',
   height: '90%'
  });

  ref1.onClose.subscribe((PopupCalculdorPalletsComponent: any) => {

        if (PopupCalculdorPalletsComponent) {
     //     console.log(PopupCalculdorPalletsComponent);
     //     console.log(PopupCalculdorPalletsComponent[0]['unidades']);
        const resultado =  this.elementos.findIndex(x => x.id === this.selectedRow.id);
        console.log(resultado);
        this.index = resultado;
       // this.elementos[resultado]['cantidad'] = PopupCalculdorPalletsComponent[0]['unidades'];
        this.cantidad =   PopupCalculdorPalletsComponent[0]['unidades'];
        this.volumen = PopupCalculdorPalletsComponent[1]['volumen'];

        }
  });

 }

 calcularHoras(): void{
  const totalTime = ((this.hora_produccion.getHours()*60) + this.hora_produccion.getMinutes());
  console.log(totalTime);
  console.log((this.selectedRow['unidad_hora']));
  this.hora_produccion_minutos = totalTime;
  this.cantidad = this.hora_produccion_minutos * (Number(this.selectedRow['unidad_hora']) /60) ;
  const resultado =  this.elementos.findIndex(x => x.id === this.selectedRow.id);
  console.log(resultado);
  this.index = resultado;
 // this.elementos[resultado]['cantidad'] = PopupCalculdorPalletsComponent[0]['unidades'];
  //this.cantidad =   PopupCalculdorPalletsComponent[0]['unidades'];
  //this.volumen = PopupCalculdorPalletsComponent[1]['volumen'];
 }

  timeConvert(n) {

  }

 agregarProducto() {
/* ---------------------------------- DATOS --------------------------------- */
  if (this.cantidad > 0) {
    const fecha = formatDate(new Date(this.fecha_produccion), 'yyyy-MM-dd', 'en');
    console.log(fecha);
    const hora = formatDate(new Date(this.hora_produccion), 'HH:mm', 'en');
    this.elementos[this.index]['fecha_produccion'] = fecha;
    this.elementos[this.index]['horas'] = hora;
    this.elementos[this.index]['cantidad'] = this.cantidad;
    this.elementos[this.index]['packs'] = this.cantidad / this.elementos[this.index]['unidades'];
    this.elementos[this.index]['grupo_nombre'] = this.selected.grupo_nombre;
    this.elementos[this.index]['grupo_id'] = this.selected.id;
    console.log(this.selected);
    console.log(this.elementos[this.index]);
    this.cantidad = 0;
    this.volumen = 0;
    // tslint:disable-next-line: max-line-length
    this.hora_produccion = new Date(this.fecha_produccion.getFullYear(), this.fecha_produccion.getMonth(), this.fecha_produccion.getDate(), 8, 0, 0);
    this.display = false;
  } else {
    this.alertServiceService.throwAlert('warning', 'La cantidad debe ser mayor a 0', '', '500');
  }

 }

detalle() {
  this.display = false;
}
  guardar() {
      this.elementos.forEach(elemento => {
          if (elemento.cantidad > 0) {

              elemento.orden_produccion_id = 0;
              elemento.cantidad_solicitada = elemento.cantidad;
              elemento.cantidad_usada = 0;
              elemento.cantidad_existente = elemento.cantidad;
              elemento.fecha_produccion = this.fecha_produccion;
              elemento.estado = 'ACTIVO';
              elemento.usuario_modifica_id = this.userData['id'];
              console.log(elemento);
              this.ref.close(elemento);
          }

      });
   /*  if (_elemento.cantidad > 0) {
      _elemento.orden_produccion_id = 0;
      _elemento.cantidad_solicitada = _elemento.cantidad;
      _elemento.cantidad_usada = 0;
      _elemento.cantidad_existente = _elemento.cantidad;
      _elemento.fecha_produccion = this.fecha_produccion;
      _elemento.estado = 'ACTIVO';
      _elemento.usuario_modifica_id = this.userData['id'];
      console.log(_elemento);
      this.ref.close(_elemento);
    } else {
      this.alertServiceService.throwAlert('warning',  ' La cantidad a producir debe ser mayor a 0', '', '500');
    } */

  }

  editarProduccion(elem: any) {

    this.selectedRow = elem;
    console.log(this.selectedRow);
    this.position = 'top';
    this.display = true;
  }

  removerProduccion(_elemento: any)  {
    const index =  this.elementos.findIndex(x => x.id === _elemento.id);
    this.elementos[index].cantidad =  '';
    this.elementos[index].fecha_produccion = '';
    this.elementos[index].grupo_nombre = '';
    this.elementos[index].horas = '';
    this.elementos[index].packs = '';
    this.selectedRow = _elemento;
  }

}
