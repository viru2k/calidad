import { Component, OnInit } from "@angular/core";
import { CalidadService } from "../../../services/calidad.service";
import { AlertServiceService } from "../../../services/alert-service.service";
import { MessageService, MenuItem } from "primeng-lts/api";
import { DialogService } from "primeng-lts/dynamicdialog";
import { calendarioIdioma } from "../../../config/config";
import { formatDate } from "@angular/common";
import { OverlayPanel } from "primeng-lts/overlaypanel";
import { PopupCalidadAsociadaProduccionComponent } from "../popup-calidad-asociada-produccion/popup-calidad-asociada-produccion.component";
import { PopupCalidadDetalleProcesoComponent } from "./../popup-calidad-detalle-proceso/popup-calidad-detalle-proceso.component";
import { ProduccionService } from "../../../services/produccion.service";
import { Filter } from "../../../shared/filter";

@Component({
  selector: "app-calidad-consulta-produccion",
  templateUrl: "./calidad-consulta-produccion.component.html",
  styleUrls: ["./calidad-consulta-produccion.component.scss"],
})
export class CalidadConsultaProduccionComponent implements OnInit {
  fecha_desde: Date;
  fecha_hasta: Date;
  _fecha_desde: string;
  _fecha_hasta: string;
  es: any;
  cols: any[];
  columns: any[];
  elemento: any;
  elementos: any[];
  selecteditems: any;
  _estado: any[] = [];
  _maquina_nombre: any[] = [];
  _nombre: any[] = [];
  loading;
  // breadcrumb
  home: MenuItem = { icon: "pi pi-home", routerLink: "/" };
  breadCrumbItems: MenuItem[];

  constructor(
    private produccionService: ProduccionService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private filter: Filter
  ) {
    this.breadCrumbItems = [
      this.home,
      { label: "Auditoria" },
      { label: "Indicadores" },
      { label: "Controles Realizados" },
    ];
    this.cols = [
      {
        field: "orden_produccion_detalle_id",
        header: "Prod Nº",
        width: "7.5%",
      },
      { field: "estado", header: "Estado", width: "12%" },
      { field: "fecha_produccion", header: "Fecha", width: "18%" },
      { field: "lote", header: "Lote", width: "18%" },
      { field: "nombre", header: "Producto", width: "40%" },
      { field: "maquina_nombre", header: "Linea", width: "18%" },
      { field: "hora_inicio", header: "Inicio", width: "8%" },
      { field: "hora_fin", header: "Fin", width: "8%" },
      { field: "cantidad_solicitada", header: "Solicitado", width: "10%" },
      { field: "", header: "En packs", width: "10%" },
      { field: "cantidad_producida", header: "Realizado", width: "10%" },
      { field: "", header: "En packs", width: "10%" },
      { field: "", header: "", width: "6%" },
    ];
  }

  ngOnInit() {
    this.es = calendarioIdioma;
    this.fecha_desde = new Date();
    this.fecha_hasta = new Date();
  }

  accion(evt: any, overlaypanel: OverlayPanel, event: any) {
    console.log(event);
    this.elemento = event;
    overlaypanel.toggle(evt);
  }

  verControles() {
    console.log(this.elemento);
    let data: any;
    data = this.elemento;
    const ref = this.dialogService.open(PopupCalidadDetalleProcesoComponent, {
      data,
      header: "Listado de controles en producción",
      width: "98%",
      height: "90%",
    });

    ref.onClose.subscribe(() => {
      //this.buscarByDates();
    });
  }

  buscarByDates() {
    this._fecha_desde = formatDate(
      new Date(this.fecha_desde),
      "yyyy-MM-dd HH:mm",
      "en"
    );
    this._fecha_hasta = formatDate(
      new Date(this.fecha_hasta),
      "yyyy-MM-dd HH:mm",
      "en"
    );
    this.loading = true;
    try {
      this.produccionService
        .getProduccionProcesoByDates(this._fecha_desde, this._fecha_hasta)
        .subscribe(
          (resp) => {
            if (resp[0]) {
              this.elementos = resp;
              this.realizarFiltroBusqueda(resp);
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

    if (estado === "NEUTRAL") {
      return { "border-es-neutral": "null" };
    }
  }

  iconoColor(estado: string) {
    if (estado === "ACTIVO") {
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

  realizarFiltroBusqueda(resp: any[]) {
    // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
    this._estado = [];
    this._maquina_nombre = [];
    this._nombre = [];

    resp.forEach((element) => {
      this._estado.push(element.estado);
      this._maquina_nombre.push(element.maquina_nombre);
      this._nombre.push(element.nombre);
    });

    // ELIMINO DUPLICADOS
    this._estado = this.filter.filterArray(this._estado);
    this._maquina_nombre = this.filter.filterArray(this._maquina_nombre);
    this._nombre = this.filter.filterArray(this._nombre);
  }
}
