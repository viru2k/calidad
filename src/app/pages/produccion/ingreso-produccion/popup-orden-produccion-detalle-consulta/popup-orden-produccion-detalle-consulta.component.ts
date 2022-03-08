import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng-lts/api";
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from "primeng-lts/dynamicdialog";
import { ProduccionService } from "./../../../../services/produccion.service";
import { AlertServiceService } from "./../../../../services/alert-service.service";
import { calendarioIdioma } from "./../../../../config/config";
import { OrdenProduccionDetalle } from "./../../../../models/orden-produccion-detalle.model";
import { PopupAsociarProduccionComponent } from "./popup-asociar-produccion/popup-asociar-produccion.component";
// tslint:disable-next-line: max-line-length
import { PopupCalculdorPalletsComponent } from "./../../../../shared/components/popups/popup-calculdor-pallets/popup-calculdor-pallets.component";
import { OverlayPanel } from "primeng-lts/overlaypanel";
import { formatDate } from "@angular/common";
import { ExporterService } from "./../../../../services/exporter.service";
import { Filter } from "./../../../../shared/filter";

@Component({
  selector: "app-popup-orden-produccion-detalle-consulta",
  templateUrl: "./popup-orden-produccion-detalle-consulta.component.html",
  styleUrls: ["./popup-orden-produccion-detalle-consulta.component.scss"],
})
export class PopupOrdenProduccionDetalleConsultaComponent implements OnInit {
  elemento: any;
  elementos: any[];
  userData: any;
  loading;
  selected: any;
  cols: any;
  elementosFiltrados: any[] = null;
  _estado: any[] = [];

  constructor(
    private alertServiceService: AlertServiceService,
    private produccionService: ProduccionService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private config: DynamicDialogConfig,
    private exporterService: ExporterService,
    private filter: Filter
  ) {
    this.cols = [
      { field: "id", header: "Prod Nº", width: "7.5%" },
      { field: "estado", header: "Estado", width: "8%" },
      { field: "fecha_produccion", header: "A producir", width: "13%" },
      { field: "nombre", header: "Producto", width: "20%" },
      { field: "", header: "Distribución", width: "17%" },
      { field: "cantidad_solicitada", header: "Solicitado", width: "14%" },
      { field: "cantidad_usada", header: "Confeccionado", width: "14%" },
      { field: "cantidad_existente", header: "Pendiente", width: "14%" },
      { field: "", header: "", width: "6%" },
    ];
  }

  ngOnInit() {
    console.log(this.config.data);
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.loadlist(this.config.data.id);
  }

  accion(evt: any, overlaypanel: OverlayPanel, event: any) {
    if (event) {
      this.selected = event;
    }
    console.log(event);
    this.elemento = event;
    overlaypanel.toggle(evt);
  }

  loadlist(produccion: any) {
    console.log(produccion);
    this.loading = true;
    try {
      this.produccionService
        .produccionDetalleByProduccionId(produccion)
        .subscribe(
          (resp) => {
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

  calcular(_elemento: any, calculo: string) {
    _elemento.a_calcular = calculo;
    const data: any = _elemento;
    const ref1 = this.dialogService.open(PopupCalculdorPalletsComponent, {
      data,
      header: "Calcular cantidad",
      width: "60%",
      height: "60%",
    });

    ref1.onClose.subscribe((PopupCalculdorPalletsComponent: any) => {
      if (PopupCalculdorPalletsComponent) {
        //     console.log(PopupCalculdorPalletsComponent);
        //     console.log(PopupCalculdorPalletsComponent[0]['unidades']);
        // const resultado =  this.elementos.findIndex(x => x.id === _elemento.id);
        //  this.elementos[resultado]['cantidad'] = PopupCalculdorPalletsComponent[0]['unidades'];
      }
    });
  }

  agregarProduccion(elemento: any) {}

  nuevaProduccion(_elemento: any) {
    console.log(this.elemento);
    _elemento.es_nuevo = true;
    this.elemento.checked = true;
    this.elemento.checked_iniciado = true;
    let data: any;
    data = this.elemento;
    const ref = this.dialogService.open(PopupAsociarProduccionComponent, {
      data,
      header: "Gestionar produccion",
      width: "70%",
      height: "80%",
    });

    ref.onClose.subscribe((PopupAsociarProduccionComponent: any) => {
      this.loadlist(this.config.data["id"]);
    });
  }

  detalleProduccion(_elemento: any) {
    /*  console.log(this.elemento);
 _elemento.es_nuevo = true;
 this.elemento.checked = true;
 this.elemento.checked_iniciado = true;
 let data: any;
 data = this.elemento;
 const ref = this.dialogService.open(PopupOrdenProduccionDetalleConsultaComponent, {
 data,
  header: 'Gestionar produccion',
  width: '70%',
  height: '80%'
 });

 ref.onClose.subscribe((PopupAsociarProduccionComponent: any) => {

   this.loadlist(this.config.data['id']);
 });
 */
  }

  estadistica(elemento: any) {}

  colorRow(estado: string) {
    if (estado === "ACTIVO") {
      return { "border-es-activo": "null" };
    }
    if (estado === "PAUSADO") {
      return { "border-es-pausado": "null" };
    }
    if (estado === "CANCELADO") {
      return { "border-es-cancelado": "null" };
    }
    if (estado === "FINALIZADO") {
      return { "border-es-finalizado": "null" };
    }
  }

  iconoColor(estado: string) {
    if (estado === "ACTIVO") {
      return { "icono-success": "null" };
    }
    if (estado === "PAUSADO") {
      return { "icono-warning": "null" };
    }
    if (estado === "CANCELADO") {
      return { "icono-danger": "null" };
    }
    if (estado === "FINALIZADO") {
      return { "icono-secondary": "null" };
    }
  }

  filtered(event) {
    console.log(event.filteredValue);
    this.elementosFiltrados = event.filteredValue;
  }

  exportarExcel() {
    const fecha_desde = formatDate(new Date(), "dd/MM/yyyy", "es-Ar");
    console.log(this.elementosFiltrados);
    if (this.elementosFiltrados == null) {
      this.elementosFiltrados = this.elementos;
    }
    this.exporterService.exportAsExcelFile(
      this.elementosFiltrados,
      "documento_" + fecha_desde
    );
  }

  expotarPdf() {}

  realizarFiltroBusqueda(resp: any[]) {
    // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
    this._estado = [];

    resp.forEach((element) => {
      this._estado.push(element["estado"]);
    });

    // ELIMINO DUPLICADOS
    this._estado = this.filter.filterArray(this._estado);
  }
}
