import { Component, OnInit } from "@angular/core";
import { InsumoService } from "../../../../services/insumo.service";
import { AlertServiceService } from "../../../../services/alert-service.service";
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from "primeng-lts/dynamicdialog";
import { MessageService } from "primeng-lts/api";
import { PopupInsumoStockDetalleProduccionComponent } from "../popup-insumo-stock-detalle-produccion/popup-insumo-stock-detalle-produccion.component";
import { Filter } from "./../../../../shared/filter";
import { formatDate } from "@angular/common";
import { ExporterService } from "./../../../../services/exporter.service";

@Component({
  selector: "app-popup-insumo-stock",
  templateUrl: "./popup-insumo-stock.component.html",
  styleUrls: ["./popup-insumo-stock.component.scss"],
})
export class PopUpInsumoStockComponent implements OnInit {
  cols: any;
  userdata: any;
  loading;
  elementos: any[];
  elementosFiltrados: any[] = null;
  _descripcion: any[] = [];
  _nombre: any[] = [];

  constructor(
    private insumoService: InsumoService,
    private alertServiceService: AlertServiceService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private messageService: MessageService,
    private exporterService: ExporterService,
    private filter: Filter
  ) {
    this.cols = [
      { field: "nombre", header: "Insumo", width: "30%" },
      { field: "comprobante", header: "Comp. nº", width: "18%" },
      { field: "lote", header: "Lote", width: "16%" },
      { field: "fecha_ingreso", header: "Ingresado", width: "18%" },
      { field: "fecha_movimiento", header: "Ultimo consumo", width: "18%" },
      { field: "cantidad", header: "Cant. ingresada", width: "12%" },
      { field: "cantidad_usada", header: "Usado", width: "12%" },
      { field: "cantidad_existente", header: "Existencia", width: "12%" },
      { field: "descripcion", header: "Deposito", width: "18%" },
      { field: "", header: "", width: "6%" },
    ];
  }

  ngOnInit() {
    console.log(this.config.data);
    this.loadlist();
  }

  loadlist() {
    this.loading = true;
    try {
      this.insumoService
        .getStockMovimientoByInsumoAndEstado(
          "ACTIVO",
          this.config.data.insumo_id
        )
        .subscribe(
          (resp) => {
            if (resp[0]) {
              this.realizarFiltroBusqueda(resp);
              this.elementos = resp;
              console.log(this.elementos);
              this.elementos.forEach((ele) => {
                ele.a_ingresar = 0;
              });
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

  detalle(elemento: any) {
    const data: any = elemento;
    const ref = this.dialogService.open(
      PopupInsumoStockDetalleProduccionComponent,
      {
        data,
        header: "Detalle del insumo en produccion",
        width: "98%",
        height: "90%",
      }
    );

    ref.onClose.subscribe((PopupInsumoStockDetalleProduccionComponent: any) => {
      if (!!PopupInsumoStockDetalleProduccionComponent) {
        this.loadlist();
      }
    });
  }

  exportarExcel() {
    const fecha = formatDate(new Date(), "dd/MM/yyyy hh:mm", "es-Ar");
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
    this._descripcion = [];
    this._nombre = [];

    resp.forEach((element) => {
      this._descripcion.push(element.descripcion);
      this._nombre.push(element.nombre);
    });

    // ELIMINO DUPLICADOS
    this._descripcion = this.filter.filterArray(this._descripcion);
    this._nombre = this.filter.filterArray(this._nombre);
  }
}
