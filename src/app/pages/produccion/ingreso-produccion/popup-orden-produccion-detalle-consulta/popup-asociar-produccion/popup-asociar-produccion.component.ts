import { Component, OnInit } from "@angular/core";
import {
  MessageService,
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/api";

import { calendarioIdioma } from "./../../../../../config/config";
import { AlertServiceService } from "./../../../../../services/alert-service.service";
import { ProduccionService } from "./../../../../../services/produccion.service";
import { formatDate } from "@angular/common";
import { ProduccionProceso } from "../../../../../models/produccion-proceso.model";
import swal from "sweetalert2";
import { PopupCalculdorPalletsComponent } from "./../../../../../shared/components/popups/popup-calculdor-pallets/popup-calculdor-pallets.component";

@Component({
  selector: "app-popup-asociar-produccion",
  templateUrl: "./popup-asociar-produccion.component.html",
  styleUrls: ["./popup-asociar-produccion.component.scss"],
})
export class PopupAsociarProduccionComponent implements OnInit {
  es: any;
  checked = true;
  checked_iniciado = true;
  loading;
  userData: any;
  fecha_desde: Date;
  fecha_hasta: Date;
  _fecha_desde: string;
  _fecha_hasta: string;
  produccionProceso: ProduccionProceso;
  producir = 0;
  lote = "";
  selectedMaquina: any = [];
  selectedDeposito: any = [];
  estado: any[] = [];
  selectedEstado = "ACTIVO";
  maquinas: any[];
  depositos: any[];
  data: any;
  // tslint:disable-next-line: max-line-length
  constructor(
    private alertServiceService: AlertServiceService,
    private produccionService: ProduccionService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {
    this.estado = [
      { name: "ACTIVO", value: "ACTIVO" },
      { name: "PAUSADO", value: "PAUSADO" },
      { name: "FINALIZADO", value: "FINALIZADO" },
      { name: "CANCELADO", value: "CANCELADO" },
    ];
  }

  ngOnInit() {
    console.log(this.config.data);
    this.data = this.config.data;
    this.checked = this.config.data.checked;
    this.checked_iniciado = this.config.data.checked_iniciado;
    if (!this.checked_iniciado) {
      this.fecha_desde = new Date(this.config.data.hora_inicio);
      this.selectedEstado = "FINALIZADO";
    } else {
      this.fecha_desde = new Date();
    }
    this.es = calendarioIdioma;

    this.fecha_hasta = new Date();
    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.config.data);
    console.log(this.checked);
    this.loadMaquina();
  }

  onChangeEstado(e) {
    console.log(e.target.value);
    this.selectedEstado = e.target.value;
  }

  loadMaquina() {
    console.log("maquina");
    this.loading = true;
    try {
      this.produccionService.getMaquinas().subscribe(
        (resp) => {
          this.maquinas = resp;
          this.selectedMaquina = this.maquinas[0];
          console.log(this.maquinas);
          this.loading = false;
          this.loadDeposito();
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
      this.loading = false;
      this.alertServiceService.throwAlert(
        "error",
        "Error: " + error.status + "  Error al cargar los registros",
        "",
        "500"
      );
    }
  }

  loadDeposito() {
    console.log("maquina");
    this.loading = true;
    try {
      this.produccionService.getDepositos().subscribe(
        (resp) => {
          this.depositos = resp;
          this.selectedDeposito = this.depositos[1];
          console.log(this.depositos);
          this.loading = false;
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
      this.loading = false;
      this.alertServiceService.throwAlert(
        "error",
        "Error: " + error.status + "  Error al cargar los registros",
        "",
        "500"
      );
    }
  }

  handleChange(e) {
    this.checked = e.checked;
    console.log(this.checked);
    if (this.checked) {
    } else {
    }
  }

  guardar() {
    const _cantidad_usada: number =
      Number(this.config.data.cantidad_usada) + Number(this.producir);
    const _cantidad_existente: number =
      Number(this.config.data.cantidad_solicitada) - Number(_cantidad_usada);

    this._fecha_desde = formatDate(
      new Date(this.fecha_desde),
      "yyyy-MM-dd HH:mm:ss",
      "en"
    );
    console.log(
      "usada " + _cantidad_usada + " existente " + _cantidad_existente
    );
    /* ----------------- SI LA CANTIDAD ES NEGATIVA NO SE GUARDA ---------------- */

    if (_cantidad_existente >= 0) {
      if (!this.checked) {
        this.produccionProceso = new ProduccionProceso(
          "0",
          this.config.data.id,
          this.config.data.articulo_id,
          this.config.data.cantidad_solicitada,
          _cantidad_usada,
          _cantidad_existente,
          this.producir,
          this.userData["id"],
          this.selectedMaquina["id"],
          this._fecha_desde,
          "",
          this.selectedEstado,
          this.config.data.orden_produccion_detalle_id,
          this.lote,
          this.selectedDeposito.id
        );
        this.setProduccion(this.produccionProceso);
      } else {
        this._fecha_hasta = formatDate(
          new Date(this.fecha_hasta),
          "yyyy-MM-dd HH:mm:ss",
          "en"
        );
        console.log(this._fecha_hasta);
        if (this.producir > 0) {
          this.produccionProceso = new ProduccionProceso(
            "0",
            this.config.data.id,
            this.config.data.articulo_id,
            this.config.data.cantidad_solicitada,
            _cantidad_usada,
            _cantidad_existente,
            this.producir,
            this.userData["id"],
            this.selectedMaquina["id"],
            this._fecha_desde,
            this._fecha_hasta,
            "FINALIZADO",
            this.config.data.orden_produccion_detalle_id,
            this.lote,
            this.selectedDeposito.id
          );
          this.setProduccion(this.produccionProceso);
        } else {
          // tslint:disable-next-line: max-line-length
          this.alertServiceService.throwAlert(
            "warning",
            "La cantidad a producir debe ser mayor a 0 si es una producción completada",
            "",
            "500"
          );
        }
      }
    } else {
      this.alertServiceService.throwAlert(
        "warning",
        "La cantidad resultante excede la cantidad solicitada",
        "",
        "500"
      );
    }

    /* -------- SI ES PRODUCCION EN CURSO EL VALOR A PRODUCIR PUEDE SER 0 ------- */

    console.log(this.selectedMaquina);
    this._fecha_desde = formatDate(
      new Date(this.fecha_desde),
      "yyyy-MM-dd HH:mm:ss",
      "en"
    );
    console.log(this._fecha_desde);

    /* ------- SI NO ES PRODUCCION EN CURSO GUARDO FECHA HASTA Y CANTIDAD ------- */
  }

  setProduccion(produccion: ProduccionProceso) {
    this.loading = true;
    try {
      this.produccionService.setProduccionProceso(produccion).subscribe(
        (resp) => {
          console.log(resp);
          this.loading = false;
          console.log(resp);
          this.alertServiceService.throwAlert(
            "success",
            "Proceso generado correctamente",
            "",
            "500"
          );

          this.ref.close();
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

  actualizar() {
    /* -------- SI ES PRODUCCION EN CURSO EL VALOR A PRODUCIR PUEDE SER 0 ------- */

    if (!this.checked) {
    } else {
      if (this.producir > 0) {
        this._fecha_desde = formatDate(
          new Date(this.fecha_desde),
          "yyyy-MM-dd HH:mm:ss",
          "en"
        );
        this._fecha_hasta = formatDate(
          new Date(this.fecha_hasta),
          "yyyy-MM-dd HH:mm:ss",
          "en"
        );
        if (this.config.data.cantidad_pendiente - this.producir >= 0) {
          this.loading = true;
          try {
            this.produccionProceso = new ProduccionProceso(
              this.config.data.id,
              this.config.data.orden_produccion_detalle_id,
              this.config.data.articulo_id,
              this.config.data.cantidad_solicitada,
              this.producir,
              this.config.data.cantidad_pendiente - this.producir,
              this.producir,
              this.userData["id"],
              this.selectedMaquina["id"],
              this._fecha_desde,
              this._fecha_hasta,
              this.selectedEstado,
              this.config.data.orden_produccion_detalle_id,
              this.lote,
              this.selectedDeposito.id
            );
            //  this.setProduccion(this.produccionProceso);

            this.produccionService
              .updProduccionProceso(this.config.data.id, this.produccionProceso)
              .subscribe(
                (resp) => {
                  console.log(resp);
                  this.loading = false;
                  console.log(resp);
                  this.alertServiceService.throwAlert(
                    "success",
                    "Proceso generado correctamente",
                    "",
                    "500"
                  );

                  this.ref.close(resp);
                },
                (error) => {
                  // error path
                  console.log(error);
                  this.alertServiceService.throwAlert(
                    "error",
                    "Error: " +
                      error.status +
                      "  Error al cargar los registros",
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
        } else {
          this.alertServiceService.throwAlert(
            "warning",
            "La cantidad producida supera el valor solicitado ",
            "",
            "500"
          );
        }
      } else {
        // tslint:disable-next-line: max-line-length
        this.alertServiceService.throwAlert(
          "warning",
          "La cantidad a producir debe ser mayor a 0 si es una producción completada",
          "",
          "500"
        );
      }
    }
  }

  calcular(_elemento: any, calculo: number) {
    _elemento.a_calcular = calculo;
    const data: any = this.config.data;
    const ref1 = this.dialogService.open(PopupCalculdorPalletsComponent, {
      data,
      header: "Calcular cantidad",
      width: "60%",
      height: "60%",
    });

    ref1.onClose.subscribe((PopupCalculdorPalletsComponent: any) => {
      if (PopupCalculdorPalletsComponent) {
        this.producir = PopupCalculdorPalletsComponent[0]["unidades"];
        //     console.log(PopupCalculdorPalletsComponent);
        //     console.log(PopupCalculdorPalletsComponent[0]['unidades']);
        // const resultado =  this.elementos.findIndex(x => x.id === _elemento.id);
        //  this.elementos[resultado]['cantidad'] = PopupCalculdorPalletsComponent[0]['unidades'];
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
}
