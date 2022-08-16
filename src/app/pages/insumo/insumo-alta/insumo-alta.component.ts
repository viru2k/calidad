import { Component, OnInit } from "@angular/core";
import { InsumoService } from "../../../services/insumo.service";
import { AlertServiceService } from "../../../services/alert-service.service";
import { MessageService, MenuItem } from "primeng-lts/api";
import { DialogService } from "primeng-lts/dynamicdialog";
import { PopupInsumoAltaComponent } from "./popup-insumo-alta/popup-insumo-alta.component";
import { Filter } from "./../../../shared/filter";

import { formatDate } from "@angular/common";
import { ExporterService } from "./../../../services/exporter.service";
import { CalculosService } from "../../../services/calculos.service";

@Component({
  selector: "app-insumo-alta",
  templateUrl: "./insumo-alta.component.html",
  styleUrls: ["./insumo-alta.component.scss"],
})
export class InsumoAltaComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;
  estado: any[] = [];
  selectedEstado: string = "ACTIVO";

  totalCantidad = 0;
  totalUsado = 0;
  totalExistencia = 0;
  elementosFiltrados: any[] = null;
  _nombre: any[] = [];
  // breadcrumb
  home: MenuItem = { icon: "pi pi-home", routerLink: "/" };
  breadCrumbItems: MenuItem[];

  // action permission
  editable_role: boolean;
  creator_role: boolean;

  constructor(
    private insumoService: InsumoService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private exporterService: ExporterService,
    private filter: Filter,
    private calculosService: CalculosService
  ) {
    this.breadCrumbItems = [
      this.home,
      { label: "Producción" },
      { label: "Ingreso de insumos" },
    ];
    this.cols = [
      { field: "nombre", header: "Insumo", width: "30%" },
      { field: "comprobante", header: "Comp. nº", width: "18%" },
      { field: "lote", header: "Lote", width: "16%" },
      { field: "fecha_ingreso", header: "Ingresado", width: "18%" },
      { field: "fecha_movimiento", header: "Ultimo consumo", width: "18%" },
      { field: "cantidad", header: "Cant. ingresada", width: "12%" },
      { field: "cantidad_usada", header: "Usado", width: "12%" },
      { field: "cantidad_existente", header: "Existencia", width: "12%" },
    ];

    this.estado = [
      { name: "ACTIVO", value: "ACTIVO" },
      { name: "PAUSADO", value: "PAUSADO" },
      { name: "FINALIZADO", value: "FINALIZADO" },
      { name: "CANCELADO", value: "CANCELADO" },
    ];
  }

  ngOnInit() {
    console.log("cargando insumo");

    const permissions = JSON.parse(localStorage.getItem("userData"));
    this.editable_role = this.calculosService.tienePermiso(
      "administracion_stock_editar",
      permissions["access_list"]
    );
    this.creator_role = this.calculosService.tienePermiso(
      "administracion_stock_alta",
      permissions["access_list"]
    );
    this.loadlist();
  }

  onChangeEstado(e) {
    console.log(e.target.value);
    this.selectedEstado = e.target.value;
    this.loadlist();
  }

  loadlist() {
    this.loading = true;
    try {
      this.insumoService
        .getStockInsumoByEstadoExistencia(this.selectedEstado, "CON_EXISTENCIA")
        .subscribe(
          (resp) => {
            if (resp[0]) {
              this.realizarFiltroBusqueda(resp);
              this.elementos = resp;
              console.log(this.elementos);
              this.sumarValores(this.elementos);
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

  buscarExistente() {
    this.loading = true;
    try {
      this.insumoService
        .getStockInsumoByEstadoExistencia(this.selectedEstado, "SIN_MOVIMIENTO")
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

  buscar() {
    let data: any;
    const ref = this.dialogService.open(PopupInsumoAltaComponent, {
      data,
      header: "Editar insumo",
      width: "98%",
      height: "90%",
    });

    ref.onClose.subscribe((ArticuloEditarComponent: any) => {
      if (!!ArticuloEditarComponent) {
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

  sumarValores(vals: any) {
    let i: number;
    console.log(vals !== undefined);
    this.totalCantidad = 0;
    this.totalExistencia = 0;
    this.totalUsado = 0;
    for (i = 0; i < vals.length; i++) {
      this.totalCantidad = this.totalCantidad + Number(vals[i]["cantidad"]);
      this.totalUsado = this.totalUsado + Number(vals[i]["cantidad_usada"]);
      this.totalExistencia =
        this.totalExistencia + Number(vals[i]["cantidad_existente"]);
    }
  }

  filtered(event) {
    console.log(event.filteredValue);
    this.elementosFiltrados = event.filteredValue;
    this.sumarValores(this.elementosFiltrados);
  }

  exportarExcel() {
    const fecha = formatDate(new Date(), "dd/MM/yyyy HH:mm", "es-Ar");
    console.log(this.elementosFiltrados);
    if (this.elementosFiltrados == null) {
      this.elementosFiltrados = this.elementos;
    }
    this.exporterService.exportAsExcelFile(
      this.elementosFiltrados,
      "_ingreso_insumos_a_stock"
    );
  }

  exportarPdf() {}

  realizarFiltroBusqueda(resp: any[]) {
    // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
    this._nombre = [];

    resp.forEach((element) => {
      this._nombre.push(element["nombre"]);
    });

    // ELIMINO DUPLICADOS
    this._nombre = this.filter.filterArray(this._nombre);
  }
}
