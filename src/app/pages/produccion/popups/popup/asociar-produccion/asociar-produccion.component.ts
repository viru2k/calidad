import { Component, OnInit } from "@angular/core";

import { Produccion } from "src/app/models/produccion.model";
import { calendarioIdioma } from "./../../../../../config/config";
import { MessageService } from "primeng-lts/api";
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from "primeng-lts/dynamicdialog";
import { AlertServiceService } from "./../../../../../services/alert-service.service";
import { formatDate } from "@angular/common";
import { ProduccionService } from "./../../../../../services/produccion.service";
import { PopupCalculdorPalletsComponent } from "./../../../../../shared/components/popups/popup-calculdor-pallets/popup-calculdor-pallets.component";
import { OrdenProduccion } from "./../../../../../models/orden-produccion.model";

/* -------------------------------------------------------------------------- */
/*       POP UP  ASOCIA LA PRODUCCION REALIZADA A LA ORDEN DE PRODUCCION      */
/* -------------------------------------------------------------------------- */

@Component({
  selector: "app-asociar-produccion",
  templateUrl: "./asociar-produccion.component.html",
  styleUrls: ["./asociar-produccion.component.scss"],
})
export class AsociarProduccionComponent implements OnInit {
  es: any;
  fecha: Date;
  _fecha: string;
  orden_pedido: OrdenProduccion;
  cantidad_botella: number = 1;
  cantidad_litros: number = 1;
  produccion: Produccion;
  loading;

  constructor(
    private produccionService: ProduccionService,
    private alertServiceService: AlertServiceService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    console.log(this.config.data);
    this.es = calendarioIdioma;
    this.fecha = new Date();
  }

  actualizarFecha(event) {
    console.log(event);
    this.fecha = event;
    console.log(new Date(this.fecha));
  }

  guardarProduccion() {
    // console.log(this.selecteditems[0]['articulo_id']);
    const userData = JSON.parse(localStorage.getItem("userData"));
    this._fecha = formatDate(this.fecha, "yyyy-MM-dd HH:mm", "en");
    this.produccion = new Produccion(
      "0",
      this.config.data["orden_produccion_articulos_id"],
      this.config.data["articulo_id"],
      this._fecha,
      "1",
      this.cantidad_botella,
      this.cantidad_litros,
      "1",
      userData["id"],
      userData["id"]
    );
    console.log(this.produccion);
    try {
      this.produccionService
        .setProduccionOrdenProduccion(this.produccion)
        .subscribe(
          (resp) => {
            this.loading = false;
            console.log(resp);
            this.alertServiceService.throwAlert(
              "success",
              "Producción agregada a orden de Produccion número " +
                this.config.data["id"],
              "",
              "200"
            );
            this.ref.close();
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
    this.ref.close();
  }

  calcularPallet() {
    let data: any;
    data = this.config.data;
    const ref = this.dialogService.open(PopupCalculdorPalletsComponent, {
      data,
      header: "Calculo de pallet",
      width: "50%",
      height: "50%",
    });
    ref.onClose.subscribe((PopupCalculdorPalletsComponent: any) => {
      this.cantidad_botella = PopupCalculdorPalletsComponent[0]["botellas"];
      this.cantidad_litros = PopupCalculdorPalletsComponent[1]["litros"];
    });
  }
}
