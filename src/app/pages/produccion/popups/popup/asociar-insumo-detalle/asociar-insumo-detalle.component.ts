import { Component, OnInit } from "@angular/core";
import { AlertServiceService } from "./../../../../../services/alert-service.service";
import { ProduccionService } from "./../../../../../services/produccion.service";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogModule,
  DynamicDialogRef,
} from "primeng-lts/dynamicdialog";
import { ExporterService } from "./../../../../../services/exporter.service";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-asociar-insumo-detalle",
  templateUrl: "./asociar-insumo-detalle.component.html",
  styleUrls: ["./asociar-insumo-detalle.component.scss"],
})
export class AsociarInsumoDetalleComponent implements OnInit {
  cols: any[];
  cols_produccion: any[];
  columns: any[];
  elementos: any[];
  elementos_produccion: any[];
  selectedElemento: any;
  selecteditems: any;
  loading;
  cantidad: number = 0;
  cantidad_botella: number = 0;
  cantidad_litros: number = 0;
  cantidad_original: number = 0;
  cantidad_salida: number = 0;
  existencia: number = 0;
  elementosFiltrados: any[] = null;

  constructor(
    private produccionService: ProduccionService,
    private alertServiceService: AlertServiceService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private exporterService: ExporterService
  ) {
    this.cols = [
      { field: "id", header: "Nº", width: "4%" },
      { field: "fecha_pedido", header: "Fecha", width: "10%" },
      { field: "descripcion", header: "Descripción", width: "30%" },
      { field: "cantidad", header: "Producción", width: "10%" },
      { field: "fecha_produccion", header: "Producido", width: "10%" },
      { field: "cantidad_botella", header: "Botellas", width: "10%" },
      { field: "cantidad_litros", header: "Litros", width: "10%" },
      { field: "fecha_ingreso", header: "Ingreso", width: "10%" },
      { field: "fecha_egreso", header: "Egreso", width: "10%" },
      { field: "cantidad_original", header: "Original", width: "10%" },
      { field: "cantidad_salida", header: "Salida", width: "10%" },
      { field: "existencia", header: "Existencia", width: "10%" },
      { field: "nombreyapellido", header: "Usuario", width: "15%" },
    ];
  }

  ngOnInit() {
    console.log(this.config.data);
    this.verDetalle();
  }

  verDetalle() {
    console.log(this.selectedElemento);
    this.loading = true;
    try {
      this.produccionService
        .getProduccionByOrdenProduccion(
          this.config.data["id"],
          this.config.data["articulo_id"]
        )
        .subscribe(
          (resp) => {
            console.log(resp);
            let i = 0;
            this.elementos = resp;
            console.log(this.elementos);
            resp.forEach((element) => {
              this.cantidad = this.elementos[i]["cantidad"];
              this.cantidad_botella =
                Number(this.cantidad_botella) +
                Number(this.elementos[i]["cantidad_botella"]);
              this.cantidad_litros =
                Number(this.cantidad_litros) +
                Number(this.elementos[i]["cantidad_litros"]);
              this.cantidad_original = this.elementos[i]["cantidad_original"];
              this.cantidad_salida =
                Number(this.cantidad_salida) +
                Number(this.elementos[i]["cantidad_salida"]);
              this.existencia =
                Number(this.existencia) +
                Number(this.elementos[i]["existencia"]);
              i++;
            });
            this.loading = false;
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

  verDetalleTodos() {
    console.log(this.selectedElemento);
    this.loading = true;
    try {
      this.produccionService
        .getProduccionByOrdenProduccionTodos(this.config.data["id"])
        .subscribe(
          (resp) => {
            console.log(resp);
            let i = 0;
            this.elementos = resp;
            console.log(this.elementos);
            resp.forEach((element) => {
              this.cantidad = this.elementos[i]["cantidad"];
              this.cantidad_botella =
                Number(this.cantidad_botella) +
                Number(this.elementos[i]["cantidad_botella"]);
              this.cantidad_litros =
                Number(this.cantidad_litros) +
                Number(this.elementos[i]["cantidad_litros"]);
              this.cantidad_original = this.elementos[i]["cantidad_original"];
              this.cantidad_salida =
                Number(this.cantidad_salida) +
                Number(this.elementos[i]["cantidad_salida"]);
              this.existencia =
                Number(this.existencia) +
                Number(this.elementos[i]["existencia"]);

              i++;
            });
            this.loading = false;
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
}
