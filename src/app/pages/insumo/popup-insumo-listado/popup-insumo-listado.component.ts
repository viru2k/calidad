import { Component, OnInit } from "@angular/core";
import { InsumoService } from "src/app/services/insumo.service";
import { MessageService } from "primeng-lts/api";
import { DialogService, DynamicDialogRef } from "primeng-lts/dynamicdialog";
import { AlertServiceService } from "./../../../services/alert-service.service";
import { StockMovimiento } from "./../../../models/stock-movimiento.model";
import { Filter } from "./../../../shared/filter";
import { formatDate } from "@angular/common";
import { calendarioIdioma } from "src/app/config/config";
import { ProduccionService } from "./../../../services/produccion.service";

@Component({
  selector: "app-popup-insumo-listado",
  templateUrl: "./popup-insumo-listado.component.html",
  styleUrls: ["./popup-insumo-listado.component.scss"],
})
export class PopupInsumoListadoComponent implements OnInit {
  es: any;
  cols: any[];
  columns: any[];
  elementos: any[];
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
  selectedDeposito: any = [];
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
      { field: "nombre", header: "Insumo", width: "25%" },
      { field: "descripcion", header: "Descripción", width: "30%" },
      { field: "unidad_descripcion", header: "Unidad", width: "16%" },
      { field: "grupo_nombre", header: "Grupo", width: "16%" },
      { field: "comprobante", header: "Comprobante", width: "16%" },
      { field: "lote", header: "Lote", width: "16%" },
      { field: "cantidad_unitaria", header: "C. unitaria", width: "12%" },
      { field: "cantidad_empaque", header: "C. Empaque", width: "12%" },
      { field: "a_ingresar", header: "A ingresar", width: "12%" },
      { field: "", header: "", width: "6%" },
    ];

    this.tipos = [
      { label: "Unidad", value: "unidad" },
      { label: "Empaque", value: "empaque" },
    ];
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.es = calendarioIdioma;
    this.fecha = new Date();
    console.log("cargando insumo");
    this.loadlist();
  }

  loadlist() {
    this.loading = true;
    try {
      this.insumoService.getInsumo().subscribe(
        (resp) => {
          if (resp[0]) {
            this.realizarFiltroBusqueda(resp);
            this.elementos = resp;
            console.log(this.elementos);
            this.elementos.forEach((ele) => {
              ele.a_ingresar = 0;
            });
            this.loadDeposito();
          } else {
            this.elementos = null;
          }
          this.loading = false;
          console.log(resp);
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
    this.selectedDeposito = this.deposito[0];
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

  recalcularCotizacion() {
    this.valor_total_pesos =
      Number(this.valor_dolar) * Number(this.valor_dolar_cotizacion);
  }

  confirmarCantidad() {
    this.elemento.comprobante = this.comprobante;
    this.elemento.a_ingresar = this.cantidad_calculada;
    this.elemento.valor_dolar_cotizacion = this.valor_dolar_cotizacion;
    this.elemento.valor_dolar = this.valor_dolar;
    this.elemento.valor_total_pesos = this.valor_total_pesos;
    this.elemento.total_renglon =
      this.valor_total_pesos * this.cantidad_calculada;
    this.elemento.lote = this.lote;
    this.elemento.fecha_vencimiento = formatDate(
      new Date(this.fecha_vencimiento),
      "yyyy-MM-dd",
      "en"
    );
    this.elemento.ultimo_deposito_id = this.selectedDeposito.id;
    this.display = false;
    this.cantidad = 0;
    this.cantidad_calculada = 0;
    this.comprobante = "X-00000-00000000";
    this.lote = "";
    this.selectedTipo = "unidad";
    this.selectedDeposito = this.deposito[0];
  }

  onChangeDeposito() {
    // console.log(e.target.value);
    console.log(this.selectedDeposito);
  }

  loadDeposito() {
    this.loading = true;
    try {
      this.produccionService.getDepositos().subscribe(
        (resp) => {
          this.deposito = resp;
          this.selectedDeposito = this.deposito[0];
          console.log(this.deposito[0]);
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
      if (Number(ele.a_ingresar) > 0) {
        console.log(ele);
        ele.fecha = formatDate(new Date(), "yyyy-MM-dd", "en");
        // tslint:disable-next-line: max-line-length
        t = new StockMovimiento(
          "",
          ele.id,
          ele.comprobante,
          ele.lote,
          ele.fecha_vencimiento,
          ele.a_ingresar,
          0,
          ele.a_ingresar,
          ele.valor_total_pesos,
          ele.valor_dolar,
          ele.total_renglon,
          this.userData.id,
          ele.fecha,
          ele.fecha,
          "ACTIVO",
          ele.descripcion,
          ele.nombre,
          ele.valor_dolar,
          ele.valor_total_pesos,
          ele.valor_dolar_cotizacion,
          ele.ultimo_deposito_id
        );
        this.elementoFinal.push(t);
      }
    });
    this.ref.close(this.elementoFinal);
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
