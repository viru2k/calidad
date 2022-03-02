import { Component, OnInit } from "@angular/core";
import { AlertServiceService } from "./../../../services/alert-service.service";
import { MessageService } from "primeng-lts/api";
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from "primeng-lts/dynamicdialog";
import { ProduccionService } from "../../../services/produccion.service";
import { CalidadService } from "../../../services/calidad.service";

import { calendarioIdioma } from "../../../config/config";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-popup-calidad-parametro-produccion-ingreso",
  templateUrl: "./popup-calidad-parametro-produccion-ingreso.component.html",
  styleUrls: ["./popup-calidad-parametro-produccion-ingreso.component.scss"],
})
export class PopupCalidadParametroProduccionIngresoComponent implements OnInit {
  fecha_desde: Date;
  fecha_hasta: Date;
  _fecha_desde: string;
  _fecha_hasta: string;
  procesoProduccionId: string;
  elemento: any = null;
  elementos: any[];
  elementosControl: any[];
  userData: any;
  loading;
  selected: any;
  selectedElemento: any;
  cols: any;
  display;
  valorObtenido = 0;
  estadoNoConformidad;
  noConformidad: string;
  accionCorrectiva: string;
  estadoAccionCorrectiva;
  hora: Date;
  fecha: Date;
  es: any;
  elementoFinal: any[] = [];
  data: any;
  tieneEstadistica;
  rating_msg = "";

  constructor(
    private alertServiceService: AlertServiceService,
    private produccionService: ProduccionService,
    private calidadService: CalidadService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {
    this.cols = [
      { field: "parametro", header: "Parámetro", width: "35%" },
      { field: "", header: "Valor", width: "26%" },
      {
        field: "es_no_conformidad_descripcion",
        header: "No conformidad",
        width: "30%",
      },
      {
        field: "tiene_accion_correctiva_descripcion",
        header: "Acción correctiva",
        width: "30%",
      },
    ];
  }

  ngOnInit() {
    this.data = this.config.data;
    this.procesoProduccionId = this.config.data.id;
    this.es = calendarioIdioma;
    this.hora = new Date();
    this.fecha = new Date();
    console.log(this.config.data);
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.getCalidadControlEncabezado(this.config.data.id);
    this.getControlByProcesoId();
  }

  onChangeControl(e: any) {
    console.log(e);
    this.getCalidadControlParametroControl();
  }

  changeValor(event, elem: any) {
    console.log(event.target.value);
    console.log(elem);
    const resultado = this.elementos.findIndex((x) => x["id"] === elem.id);
    this.elementos[resultado]["calidad_valor"] = event.target.value;
    this.elementos[resultado]["calidad_ranking"] = 0;
    this.elementos[resultado]["calidad_verificado"] = "NO";
    this.elementos[resultado]["calidad_tiempo"] = "00:00";
    console.log(this.elementos[resultado]);
  }

  changeRanking(event, elem: any) {
    console.log(event.target.value);
    const resultado = this.elementos.findIndex((x) => x["id"] === elem.id);
    this.elementos[resultado]["calidad_ranking"] = event.target.value;
    this.elementos[resultado]["calidad_valor"] = 0;
    this.elementos[resultado]["calidad_verificado"] = "NO";
    this.elementos[resultado]["calidad_tiempo"] = "00:00";
    console.log(this.elementos[resultado]);
  }

  changeEstado(event, elem: any) {
    console.log(event);

    const resultado = this.elementos.findIndex((x) => x["id"] === elem.id);
    if (event) {
      this.elementos[resultado]["calidad_verificado"] = "SI";
    } else {
      this.elementos[resultado]["calidad_verificado"] = "NO";
    }
    this.elementos[resultado]["calidad_valor"] = 0;
    this.elementos[resultado]["calidad_ranking"] = 0;
    this.elementos[resultado]["calidad_tiempo"] = "00:00";
    console.log(this.elementos[resultado]);
  }

  changeTiempo(event, elem: any) {
    console.log(event);
    console.log(elem);
    const fecha = formatDate(new Date(event), "yyyy-MM-dd HH:mm", "en");
    const resultado = this.elementos.findIndex((x) => x["id"] === elem.id);
    this.elementos[resultado]["calidad_ranking"] = 0;
    this.elementos[resultado]["calidad_valor"] = 0;
    this.elementos[resultado]["calidad_verificado"] = "NO";
    this.elementos[resultado]["calidad_tiempo"] = fecha;
    console.log(this.elementos[resultado]);
  }

  changeAccionCorrectiva(event, elem: any) {
    console.log(event.target.value);
    const resultado = this.elementos.findIndex((x) => x["id"] === elem.id);
    this.elementos[resultado]["tiene_accion_correctiva_descripcion"] =
      event.target.value;
    this.elementos[resultado].tiene_accion_correctiva = "SI";
    console.log(this.elementos[resultado]);
  }

  changeNoConformidad(event, elem: any) {
    console.log(event.target.value);
    const resultado = this.elementos.findIndex((x) => x["id"] === elem.id);
    this.elementos[resultado]["es_no_conformidad_descripcion"] =
      event.target.value;
    this.elementos[resultado].es_no_conformidad = "SI";
    console.log(this.elementos[resultado]);
  }

  handleRate(event, elem: any) {
    //this.rating_msg = 'Rango' + event.value;
    console.log(event.value);
    const resultado = this.elementos.findIndex((x) => x["id"] === elem.id);
    this.elementos[resultado]["calidad_ranking"] = event.value;
    console.log(this.elementos[resultado]);
  }

  guardarControl() {
    let i = 0;
    console.log(this.elementos);
    this.elementos.forEach((ele) => {
      console.log(ele);

      const fecha =
        formatDate(new Date(this.fecha), "yyyy-MM-dd", "en") +
        " " +
        formatDate(new Date(this.hora), "HH:mm:ss", "en");
      this.elementos[i]["fecha"] = fecha;
      this.elementos[i]["produccion_proceso_id"] = this.procesoProduccionId;
      this.elementos[i]["usuario_modifica_id"] = this.config.data.id;
      this.elementoFinal.push(this.elementos[i]);
      console.log(this.elementos[i]["calidad_verificado"]);
      if (!this.elementos[i]["es_no_conformidad_descripcion"]) {
        this.elementos[i]["es_no_conformidad_descripcion"] = "";
        this.elementos[i].es_no_conformidad = "NO";
      }
      if (!this.elementos[i]["tiene_accion_correctiva_descripcion"]) {
        this.elementos[i]["tiene_accion_correctiva_descripcion"] = "";
        this.elementos[i].tiene_accion_correctiva = "NO";
      }
      if (!this.elementos[i]["calidad_verificado"]) {
        this.elementos[i]["calidad_verificado"] = "NO";
      }

      if (!this.elementos[i]["calidad_ranking"]) {
        this.elementos[i]["calidad_ranking"] = 0;
      }
      console.log(this.elementos[i]["calidad_valor"]);
      if (!this.elementos[i]["calidad_valor"]) {
        this.elementos[i]["calidad_valor"] = 0;
      }
      console.log(this.elementos[i]["calidad_tiempo"]);
      if (!this.elementos[i]["calidad_tiempo"]) {
        this.elementos[i]["calidad_tiempo"] = "00:00";
      }
      i++;
      //   console.log(fecha);
    });
    console.log(this.elementos);
    this.loading = true;
    try {
      this.calidadService
        .setCalidadControlParametrosValor(this.elementos)
        .subscribe(
          (resp) => {
            this.loading = false;
            console.log(resp);
            this.alertServiceService.throwAlert(
              "success",
              "Control generado correctamente",
              "",
              "200"
            );
            this.ref.close(resp);
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

  accion(evt: any, event: any) {
    if (event) {
      // this.selectedElemento = event;
    }
    console.log(event);
    this.elemento = event;
    this.display = true;
  }

  getCalidadControlEncabezado(produccion: any) {
    console.log(produccion);
    this.loading = true;
    try {
      this.calidadService.getCalidadControlEncabezado().subscribe(
        (resp) => {
          if (resp[0]) {
            this.elementosControl = resp;
            console.log(this.elementosControl);
          } else {
            this.elementosControl = null;
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

  getCalidadControlParametroControl() {
    console.log(this.selected);
    this.loading = true;
    try {
      this.calidadService
        .getCalidadControlParametroControl(this.selected.id)
        .subscribe(
          (resp) => {
            if (resp[0]) {
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

  getControlByProcesoId() {
    console.log(this.data.produccion_proceso_id);
    this.loading = true;
    try {
      this.calidadService
        .getControlByProcesoId(this.data.produccion_proceso_id)
        .subscribe(
          (resp) => {
            if (resp[0]) {
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

  estadistica(elemento: any) {}

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
