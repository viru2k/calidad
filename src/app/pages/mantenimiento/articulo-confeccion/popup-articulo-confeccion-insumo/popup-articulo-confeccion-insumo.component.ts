import { Component, OnInit } from "@angular/core";
import { ArticuloConfeccionEditarComponent } from "./../../articulo-confeccion-editar/articulo-confeccion-editar.component";

import { MessageService } from "primeng-lts/api";
import { DialogService, DynamicDialogConfig } from "primeng-lts/dynamicdialog";

import { ArticuloService } from "./../../../../services/articulo.service";
import { AlertServiceService } from "./../../../../services/alert-service.service";
import { PopupInsumoConsultaComponent } from "../../../../shared/components/popups/popup-insumo-consulta/popup-insumo-consulta.component";
import { PopupInsumoAsociarArticuloComponent } from "./popup-insumo-asociar-articulo/popup-insumo-asociar-articulo.component";
import { formatDate } from "@angular/common";
import { ExporterService } from "./../../../../services/exporter.service";

@Component({
  selector: "app-popup-articulo-confeccion-insumo",
  templateUrl: "./popup-articulo-confeccion-insumo.component.html",
  styleUrls: ["./popup-articulo-confeccion-insumo.component.scss"],
})
export class PopupArticuloConfeccionInsumoComponent implements OnInit {
  cols: any[];
  colsConfeccion: any[];
  columns: any[];
  elementos: any[];

  selecteditems: any;
  loading;
  elemento: any;
  userData: any;
  elementosFiltrados: any[] = null;

  // tslint:disable-next-line: max-line-length
  constructor(
    private alertServiceService: AlertServiceService,
    private articuloService: ArticuloService,
    public dialogService: DialogService,
    private exporterService: ExporterService,
    private messageService: MessageService,
    private config: DynamicDialogConfig
  ) {
    this.cols = [
      { field: "insumo_nombre", header: "Insumo", width: "30%" },
      { field: "insumo_descripcion", header: "Descripción", width: "40%" },
      { field: "cantidad", header: "Cantidad", width: "10%" },
      { field: "stock_armado_producto_estado", header: "Estado", width: "20%" },
      { field: "", header: "", width: "6%" },
    ];
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.loadlistConfeccion(this.config.data);
  }

  loadlistConfeccion(_elemento: any) {
    this.loading = true;
    console.log(_elemento);
    try {
      this.articuloService
        .getArticuloConfeccionByArticuloId(_elemento.id)
        .subscribe(
          (resp) => {
            this.elementos = resp;
            console.log(this.elementos);
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
    data = this.elemento;
    console.log(data);
    if (data) {
      const ref = this.dialogService.open(PopupInsumoAsociarArticuloComponent, {
        data,
        header: "Asociar insumo",
        width: "98%",
        height: "90%",
      });

      ref.onClose.subscribe((PopupInsumoAsociarArticuloComponent: any) => {
        if (ArticuloConfeccionEditarComponent) {
          console.log(ArticuloConfeccionEditarComponent);
        }
      });
    }
  }

  editarInsumo(res: any) {
    console.log("editar");
    console.log(res);

    let data: any;
    data = res;
    const ref = this.dialogService.open(PopupInsumoAsociarArticuloComponent, {
      data,
      header: "Asociar insumo",
      width: "98%",
      height: "90%",
    });

    // tslint:disable-next-line: no-shadowed-variable
    ref.onClose.subscribe((PopupInsumoAsociarArticuloComponent: any) => {
      if (PopupInsumoAsociarArticuloComponent) {
        this.loadlistConfeccion(this.config.data);
      }
    });
  }

  guardarCambio(event, elemento) {
    if (event.key === "Enter") {
      console.log(elemento);
      elemento.estado = "ACTIVO";
      elemento.usuario_modifica_id = this.userData["id"];
      elemento.articulo_id = elemento.id;
      try {
        this.articuloService.updateStockArmadoProducto(elemento).subscribe(
          (resp) => {
            console.log(resp);
            this.loading = false;
            console.log(resp);
            this.loadlistConfeccion(this.config.data);
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
        this.alertServiceService.throwAlert(
          "error",
          "Error: " + error.status + "  Error al cargar los registros",
          "",
          "500"
        );
      }
    }
    console.log(event);
  }

  nuevo() {
    const data: any = this.config.data;
    const ref = this.dialogService.open(PopupInsumoAsociarArticuloComponent, {
      data,
      header: "Asociar insumo",
      width: "98%",
      height: "90%",
    });
    ref.onClose.subscribe((PopupInsumoAsociarArticuloComponent: any) => {
      this.loadlistConfeccion(this.config.data);
    });
  }

  borrar(elemento) {
    console.log("borrando");
    console.log(elemento);
    this.loading = true;
    try {
      this.articuloService
        .delArticuloProduccion(elemento.stock_armado_producto_id)
        .subscribe(
          (resp) => {
            console.log(resp);
            this.loading = false;
            this.loadlistConfeccion(this.config.data);
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
    const fecha = formatDate(new Date(), "dd/MM/yyyy hh:mm", "es-Ar");
    console.log(this.elementosFiltrados);
    if (this.elementosFiltrados == null) {
      this.elementosFiltrados = this.elementos;
    }
    this.exporterService.exportAsExcelFile(
      this.elementosFiltrados,
      "INSUMOS DEL PRODUCTO_" + this.config.data.nombre + "-"
    );
  }

  exportarPdf() {}
}
