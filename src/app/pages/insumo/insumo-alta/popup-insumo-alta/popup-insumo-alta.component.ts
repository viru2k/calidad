import { Component, OnInit } from "@angular/core";
import { InsumoService } from "src/app/services/insumo.service";
import { AlertServiceService } from "../../../../services/alert-service.service";
import { DialogService, MessageService, DynamicDialogRef } from "primeng/api";
import { calendarioIdioma } from "../../../../config/config";
import { formatDate } from "@angular/common";
import { StockMovimiento } from "../../../../models/stock-movimiento.model";
import { Filter } from "./../../../../shared/filter";
import { PopupInsumoListadoComponent } from "../../popup-insumo-listado/popup-insumo-listado.component";
import { ProduccionService } from "./../../../../services/produccion.service";

@Component({
  selector: "app-popup-insumo-alta",
  templateUrl: "./popup-insumo-alta.component.html",
  styleUrls: ["./popup-insumo-alta.component.scss"],
  providers: [DialogService],
})
export class PopupInsumoAltaComponent implements OnInit {
  es: any;
  cols: any[];
  columns: any[];
  elementos: any[] = [];
  selecteditems: any;
  loading;
  cantidad = 0;
  comprobante: string = "X-00000-00000000";
  lote = "";
  fecha_vencimiento = new Date();
  cantidad_calculada = 0;
  display;
  elemento: any;
  tipos: any[];
  elementoFinal: StockMovimiento[] = [];
  selectedTipo = "unidad";
  fecha: Date;
  userData: any;
  _nombre: any[] = [];
  _grupo_nombre: any[] = [];
  valor_dolar_cotizacion = 1;
  valor_dolar = 1;
  valor_total_pesos = 1;
  selectedDeposito: any;
  deposito: any[] = [];
  // tslint:disable-next-line: max-line-length
  constructor(
    private insumoService: InsumoService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private produccionService: ProduccionService,
    public ref: DynamicDialogRef,
    private filter: Filter
  ) {
    this.cols = [
      { field: "", header: "", width: "6%" },
      { field: "nombre", header: "Insumo", width: "25%" },
      { field: "descripcion", header: "Descripción", width: "30%" },
      { field: "comprobante", header: "Comprobante", width: "16%" },
      { field: "lote", header: "Lote", width: "16%" },
      { field: "a_ingresar", header: "A ingresar", width: "12%" },
      { field: "", header: "", width: "6%" },
    ];
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.es = calendarioIdioma;
    this.fecha = new Date();
    console.log("cargando insumo");
  }

  loadlist(element: any[]) {
    let t: StockMovimiento;
    let i = 0;
    console.log(element);
    element.forEach((ele) => {
      if (Number(ele.cantidad) > 0) {
        ele.fecha = formatDate(new Date(), "yyyy-MM-dd", "en");
        console.log(ele);

        //   t = new StockMovimiento('', ele.insumo_id, ele.comprobante, ele.lote, ele.cantidad,0, ele.cantidad, ele.valor_total_pesos, ele.valor_total_pesos, (this.cantidad_calculada * ele.valor_total_pesos), this.userData.id, ele.fecha, ele.fecha, 'ACTIVO', ele.descripcion, ele.nombre, ele.importe_dolares, ele.importe_total_dolares, ele.importe_cotizacion_dolar) ;

        this.elementos.push(ele);
      }
    });
    console.log(this.elementos);
  }

  accion(evt: any, event: any) {
    if (event) {
      // this.selectedElemento = event;
    }
    console.log(event);
    this.elemento = event;
    this.valor_dolar_cotizacion = 1;
    this.valor_dolar = Number(this.elemento.precio_unitario);
    this.valor_total_pesos = Number(this.elemento.precio_unitario);
    this.display = true;
  }

  eliminarSeleccionado(element: any) {
    console.log(element);
    console.log(this.elementos.indexOf(element));
    const index = this.elementos.indexOf(element);
    if (index > -1) {
      this.elementos.splice(index, 1);
      console.log(this.elementos);
    }
  }

  //cuando oprimo escape
  escape() {
    this.cantidad_calculada = 0;
    this.cantidad = 0;
    this.valor_dolar_cotizacion = 1;
    this.valor_total_pesos = 1;
    this.selectedTipo = "unidad";
  }

  recalcular() {
    console.log(this.selectedTipo);
    console.log(this.elemento);
    if (this.selectedTipo === "empaque") {
      this.cantidad_calculada =
        this.cantidad * Number(this.elemento.cantidad_empaque);
      console.log(this.cantidad_calculada);
    } else {
      this.cantidad_calculada =
        this.cantidad * Number(this.elemento.cantidad_unitaria);
    }
  }

  confirmarCantidad() {
    this.elemento.comprobante = this.comprobante;
    this.elemento.a_ingresar = this.cantidad_calculada;
    //this.elemento.valor_dolar_cotizacion = this.valor_dolar_cotizacion;
    //this.elemento.valor_dolar = this.valor_dolar;
    //this.valor_total_pesos = this.valor_total_pesos;
    this.elemento.lote = this.lote;
    this.display = false;
    this.cantidad = 0;
    this.cantidad_calculada = 0;
    this.selectedTipo = "unidad";
  }

  recalcularCotizacion() {
    this.valor_total_pesos =
      Number(this.valor_dolar) * Number(this.valor_dolar_cotizacion);
  }

  agregarInsumo() {
    let data: any;
    const ref = this.dialogService.open(PopupInsumoListadoComponent, {
      data,
      header: "Seleccionar insumo",
      width: "98%",
      height: "90%",
    });

    ref.onClose.subscribe((PopupInsumoListadoComponent: any) => {
      if (PopupInsumoListadoComponent) {
        console.log(PopupInsumoListadoComponent);
        this.loadlist(PopupInsumoListadoComponent);
      }
    });
  }

  onChangeDeposito(e) {
    console.log(e.target.value);
    this.selectedDeposito = e.target.value;
  }

  loadDeposito() {
    console.log("maquina");
    this.loading = true;
    try {
      this.produccionService.getDepositos().subscribe(
        (resp) => {
          this.deposito = resp;
          this.selectedDeposito = this.deposito[0];
          console.log(this.deposito);
          this.loading = false;
        },
        (error) => {
          // error path
          console.log(error);
          this.alertServiceService.throwAlert(
            "error",
            "Error: " + error.status + "  Error al cargar los registros",
            "",
            "500"
          );
        }
      );
    } catch (error) {
      this.loading = false;
      this.alertServiceService.throwAlert(
        "error",
        "Error: " + error.status + "  Error al cargar los registros",
        "",
        "500"
      );
    }
  }

  guardar() {
    // ARMO EL ARREGLO DE LOS ELEMENTOS QUE TIENEN CANTIDAD
    let t: StockMovimiento;
    let i = 0;
    this.elementos.forEach((ele) => {
      console.log(ele);
      if (Number(ele.cantidad) > 0) {
        ele.fecha = formatDate(new Date(this.fecha), "yyyy-MM-dd", "en");
        // tslint:disable-next-line: max-line-length
        //    t = new StockMovimiento('', ele.insumo_id, ele.comprobante, ele.lote, ele.cantidad, 0, ele.cantidad, ele.valor_total_pesos,ele.valor_total_pesos, (this.cantidad_calculada * this.valor_total_pesos), this.userData.id, ele.fecha, ele.fecha, 'ACTIVO', ele.descipcion, ele.nombre, ele.valor_dolar_cotizacion, ele.valor_dolar, ele.importe_cotizacion_dolar) ;
        this.elementoFinal.push(ele);
      }
    });
    try {
      this.insumoService.setInsumoStock(this.elementoFinal).subscribe(
        (resp) => {
          if (resp[0]) {
            //  this.elementos = resp;
            this.alertServiceService.throwAlert(
              "success",
              "Se guardaron los insumos seleccionados",
              "",
              "200"
            );
            this.ref.close();
          } else {
            //  this.elementos = null;
          }
          this.loading = false;
          console.log(resp);
          this.ref.close();
        },
        (error) => {
          // error path
          console.log(error);
          this.alertServiceService.throwAlert(
            "error",
            "Error: " + error.status + "  Error al cargar los registros",
            "",
            "500"
          );
        }
      );
    } catch (error) {
      this.alertServiceService.throwAlert(
        "error",
        "Error: " + error.status + "  Error al cargar los registros",
        "",
        "500"
      );
    }

    console.log(this.elementoFinal);
  }

  setColorColumn(color: string) {
    //  console.log('color: ' + color + '!important;');
    //return {color: #CCCA3F!important; : 'null' };
    document.documentElement.style.setProperty("--custom-primary-color", color);
    // return document.documentElement.style.setProperty('--custom-grid-color', color);
    return { "change-grid-color": "null" };

    //  color: #9E9E9E!important;

    // return  'color: ' + color + '!important;';
  }

  parseTrueHexa(str) {
    return str.match(/^ *[a-f0-9]+ *$/i) ? parseInt(str, 16) : NaN;
  }

  iconoColor(estado: number) {
    if (estado !== 0) {
      return { "icono-danger": "null" };
    }
    /* if (estado === 'PAUSADO') {
    return {'icono-warning'  : 'null' };
  }
  if (estado === 'CANCELADO') {
    return {'icono-danger'  : 'null' };
  }
  if (estado === 'FINALIZADO') {
    return {'icono-secondary'  : 'null' };
  } */
  }

  realizarFiltroBusqueda(resp: any[]) {
    // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
    this._nombre = [];
    this._grupo_nombre = [];

    resp.forEach((element) => {
      this._nombre.push(element["nombre"]);
      this._grupo_nombre.push(element["grupo_nombre"]);
    });

    // ELIMINO DUPLICADOS
    this._nombre = this.filter.filterArray(this._nombre);
    this._grupo_nombre = this.filter.filterArray(this._grupo_nombre);
  }
}
