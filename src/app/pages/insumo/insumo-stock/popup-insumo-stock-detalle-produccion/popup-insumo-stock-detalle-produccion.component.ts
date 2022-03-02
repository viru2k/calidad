import { Component, OnInit } from "@angular/core";
import { InsumoService } from "../../../../services/insumo.service";
import { AlertServiceService } from "../../../../services/alert-service.service";

import { MessageService } from "primeng-lts/api";

import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from "primeng-lts/dynamicdialog";

@Component({
  selector: "app-popup-insumo-stock-detalle-produccion",
  templateUrl: "./popup-insumo-stock-detalle-produccion.component.html",
  styleUrls: ["./popup-insumo-stock-detalle-produccion.component.scss"],
})
export class PopupInsumoStockDetalleProduccionComponent implements OnInit {
  cols: any;
  userdata: any;
  loading;
  elementos: any[];

  constructor(
    private insumoService: InsumoService,
    private alertServiceService: AlertServiceService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService
  ) {
    this.cols = [
      { field: "articulo_nombre", header: "Producto", width: "30%" },
      { field: "descripcion", header: "Descripción", width: "25%" },
      { field: "cantidad_usada", header: "Usado", width: "16%" },
      { field: "fecha_movimiento", header: "Afectado", width: "18%" },
      { field: "lote", header: "Lote", width: "12%" },
      { field: "nombreyapellido", header: "Usuario", width: "18%" },
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
        .getStockMovimientoByMovimientoId(this.config.data.id)
        .subscribe(
          (resp) => {
            if (resp[0]) {
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
}
