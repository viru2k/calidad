import { Component, OnInit } from "@angular/core";
import { AlertServiceService } from "../../../services/alert-service.service";
import { ArticuloService } from "./../../../services/articulo.service";
import { MessageService, MenuItem } from "primeng-lts/api";
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from "primeng-lts/dynamicdialog";
import { PopOrdenProduccionEditarComponent } from "./pop-orden-produccion-editar/pop-orden-produccion-editar.component";
import { ProduccionService } from "../../../services/produccion.service";
import { calendarioIdioma } from "./../../../config/config";
import { Filter } from "../../../shared/filter";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-orden-produccion",
  templateUrl: "./orden-produccion.component.html",
  styleUrls: ["./orden-produccion.component.scss"],
})
export class OrdenProduccionComponent implements OnInit {
  fechaHoy: Date;
  _fechaHoy: string;
  fecha: Date;
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;
  userData: any;
  es: any;
  checked;
  items: any[];

  _estado: any[] = [];
  _nombreyapellido: any[] = [];
  _fecha_creacion: any[] = [];
  // breadcrumb
  home: MenuItem = { icon: "pi pi-home", routerLink: "/" };
  breadCrumbItems: MenuItem[];
  constructor(
    private alertServiceService: AlertServiceService,
    private produccionService: ProduccionService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private filter: Filter
  ) {
    this.breadCrumbItems = [
      this.home,
      { label: "Panifiación de Producción" },
      { label: "Orden de Producción" },
    ];

    this.cols = [
      { field: "id", header: "Prod Nº", width: "7.5%" },
      { field: "estado", header: "Estado", width: "8%" },
      { field: "fecha_creacion", header: "Creado", width: "10%" },
      { field: "descripcion", header: "Descripción", width: "40%" },
      { field: "observacion", header: "Observación", width: "25%" },
      { field: "fecha_desde", header: "Inicio", width: "12%" },
      { field: "fecha_hasta", header: "Fin", width: "12%" },
      { field: "nombreyapellido", header: "Usuario", width: "12%" },
      { field: "", header: "", width: "6%" },
    ];
  }

  ngOnInit() {
    this.items = [
      { label: "Step 1" },
      { label: "Step 2" },
      { label: "Step 3" },
    ];
    this.userData = JSON.parse(localStorage.getItem("userData"));
    // this.alertServiceService.throwAlert('success','Articulo guardado','','201');
    this.es = calendarioIdioma;
    this.fechaHoy = new Date();
    this.fecha = new Date();
    this.loadlist();
  }

  handleChange(e) {
    this.checked = e.checked;
    console.log(this.checked);
    if (this.checked) {
      this.loadlistTodos();
    } else {
      this.loadlist();
    }
  }

  loadlist() {
    this.loading = true;
    try {
      this.produccionService.getOrdenProduccionEstado("ACTIVO").subscribe(
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

  loadlistTodos() {
    this.loading = true;
    try {
      this.produccionService.getOrdenProduccionEstado("FINALIZADO").subscribe(
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

  buscar(elemento: any) {
    console.log(elemento);
    let data: any;
    data = elemento;
    const ref = this.dialogService.open(PopOrdenProduccionEditarComponent, {
      data,
      header: "Orden producción",
      width: "98%",
      height: "90%",
    });

    ref.onClose.subscribe((PopOrdenProduccionEditarComponent: any) => {
      if (!!PopOrdenProduccionEditarComponent) {
        this.loadlist();
      }
    });
  }

  nuevo() {
    const data: any = null;
    const ref = this.dialogService.open(PopOrdenProduccionEditarComponent, {
      data,
      header: "Orden producción",
      width: "98%",
      height: "90%",
    });
    ref.onClose.subscribe((PopOrdenProduccionEditarComponent: any) => {
      if (!!PopOrdenProduccionEditarComponent) {
        this.loadlist();
      }
    });
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

  realizarFiltroBusqueda(resp: any[]) {
    // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
    this._estado = [];
    this._nombreyapellido = [];
    this._fecha_creacion = [];
    resp.forEach((element) => {
      this._estado.push(element.estado);
      this._nombreyapellido.push(element.nombreyapellido);
      this._fecha_creacion.push(element.fecha_creacion);
    });

    // ELIMINO DUPLICADOS
    this._estado = this.filter.filterArray(this._estado);
    this._nombreyapellido = this.filter.filterArray(this._nombreyapellido);
    this._fecha_creacion = this.filter.filterArray(this._fecha_creacion);
  }

  test(event): string {
    console.log(formatDate(new Date(event), "dd/MM/yyyy", "en"));
    return formatDate(new Date(event), "dd/MM/yyyy", "en");
  }
}
