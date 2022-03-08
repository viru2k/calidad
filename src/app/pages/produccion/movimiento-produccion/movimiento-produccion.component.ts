import { Component, OnInit } from "@angular/core";
import { AlertServiceService } from "../../../services/alert-service.service";
import { ArticuloService } from "./../../../services/articulo.service";
import { MessageService, MenuItem } from "primeng-lts/api";
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from "primeng-lts/dynamicdialog";
import { calendarioIdioma } from "./../../../config/config";
import { ProduccionService } from "./../../../services/produccion.service";
import { formatDate } from "@angular/common";
import { OverlayPanel } from "primeng-lts/overlaypanel";
import { OrdenProduccion } from "./../../../models/orden-produccion.model";

@Component({
  selector: "app-movimiento-produccion",
  templateUrl: "./movimiento-produccion.component.html",
  styleUrls: ["./movimiento-produccion.component.scss"],
})
export class MovimientoProduccionComponent implements OnInit {
  es: any;
  cols: any[];
  cols_produccion: any[];
  columns: any[];
  elementos: any[];
  elementos_produccion: any[];
  selectedElemento: any;
  selecteditems: any;
  loading;
  fecha: Date;
  orden_pedido: OrdenProduccion;
  // breadcrumb
  home: MenuItem = { icon: "pi pi-home", routerLink: "/" };
  breadCrumbItems: MenuItem[];
  constructor(
    private alertServiceService: AlertServiceService,
    private articuloService: ArticuloService,
    private produccionService: ProduccionService,
    public dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.breadCrumbItems = [
      this.home,
      { label: "Gestión de Producción" },
      { label: "Movimientos de Producción" },
    ];
    this.cols = [
      { field: "accion", header: "Accion", width: "6%" },
      { field: "id", header: "Nº", width: "6%" },
      { field: "fecha_pedido", header: "Fecha pedido", width: "10%" },
      { field: "descripcion", header: "Descripcion", width: "40%" },
      { field: "cantidad", header: "Cantidad", width: "10%" },
      { field: "nombreyapellido", header: "Usuario", width: "40%" },
    ];
  }

  ngOnInit() {
    this.es = calendarioIdioma;
    this.fecha = new Date();
    this.verDetalle();
  }

  actualizarFecha(event) {
    console.log(event);
    this.fecha = event;
    console.log(new Date(this.fecha));
  }

  accion(event: any, overlaypanel: OverlayPanel, elementos: any) {
    if (elementos) {
      this.selectedElemento = elementos;
      console.log(elementos);
    }
    overlaypanel.toggle(event);
  }

  verDetalle() {
    console.log(this.selectedElemento);
    this.loading = true;
    try {
      this.produccionService
        .getOrdenProduccionDetalleByEstado("ACTIVO")
        .subscribe(
          (resp) => {
            this.elementos = resp;
            this.loading = false;
            console.log(resp);
          },
          (error) => {
            // error path
            console.log(error);
            this.loading = false;
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
}
