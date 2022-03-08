import { Component, OnInit } from "@angular/core";
import { ProduccionService } from "../../../services/produccion.service";
import { MessageService } from "primeng-lts/api";
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from "primeng-lts/dynamicdialog";
import { AlertServiceService } from "../../../services/alert-service.service";
import { CalidadService } from "../../../services/calidad.service";
import { calendarioIdioma } from "../../../config/config";

import * as CanvasJS from "../../../../assets/canvasjs.min";
import { CalculosService } from "../../../services/calculos.service";
import { PopupCalidadDetalleProcesoControlComponent } from "./popup-calidad-detalle-proceso-control/popup-calidad-detalle-proceso-control.component";

@Component({
  selector: "app-popup-calidad-detalle-proceso",
  templateUrl: "./popup-calidad-detalle-proceso.component.html",
  styleUrls: ["./popup-calidad-detalle-proceso.component.scss"],
})
export class PopupCalidadDetalleProcesoComponent implements OnInit {
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

  constructor(
    private alertServiceService: AlertServiceService,
    private produccionService: ProduccionService,
    private calidadService: CalidadService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    public calculos: CalculosService
  ) {
    this.cols = [
      { field: "calidad_titulo", header: "Control", width: "36%" },
      { field: "calidad_descripcion", header: "Descripción", width: "40%" },
      { field: "ficha_nro", header: "Registro nro", width: "16%" },
      { field: "", header: "", width: "10%" },
    ];
  }

  ngOnInit() {
    this.tieneEstadistica = true;

    //console.log(this.parametrizarChart.parametrizarY());

    this.data = this.config.data;
    this.procesoProduccionId = this.config.data.id;
    this.es = calendarioIdioma;
    this.fecha_desde = new Date();
    this.fecha_hasta = new Date();
    console.log(this.config.data);
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.loadProduccionDetalle();

    this.tieneEstadistica = true;
    // this.verEstadistica();
  }

  loadProduccionDetalle() {
    console.log(this.selectedElemento);
    this.loading = true;
    try {
      this.calidadService
        .getControlesByIdProduccion(this.config.data.id)
        .subscribe(
          (resp) => {
            console.log(resp);
            this.elementos = resp;
            console.log(this.elementos);
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

  buscarByDates() {}

  detalle(elem: any) {
    console.log(elem);
    const data: any = elem;

    const ref = this.dialogService.open(
      PopupCalidadDetalleProcesoControlComponent,
      {
        data,
        header: "Detalle de controles realizados",
        width: "98%",
        height: "90%",
      }
    );

    ref.onClose.subscribe(() => {
      //this.buscarByDates();
    });
  }

  verEstadistica() {
    console.log("buscar");

    // PARAMETROS PARA EL CHART

    let r: any[] = [
      { x: 1, y: 70.735 },
      { x: 2, y: 74.102 },
      { x: 3, y: 72.569 },
      { x: 4, y: 72.743 },
      { x: 5, y: 72.381 },
      { x: 6, y: 71.406 },
      { x: 7, y: 73.163 },
      { x: 8, y: 74.27 },
      { x: 9, y: 72.525 },
      { x: 10, y: 73.121 },
    ];
    let y: any[] = [];
    r.forEach((element) => {
      y.push(element.y);
    });
    //this.parametrizarChart.parametrizarY(y);
    let dataresp: any[] = [];
    dataresp = this.calculos.parametrizarXY(r);

    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Detalle de Controles realizados para : " + this.data.nombre,
      },
      axisY: {
        title: "Botellas producidas",
        includeZero: false,
        suffix: " Bot/hs",
      },
      data: [
        {
          type: "splineArea",
          xValueFormatString: "#,##0.##",
          yValueFormatString: "#,##0.## Bot/h",
          showInLegend: true,
          legendText: "botellas",
          dataPoints: dataresp,
        },
      ],
    });
    chart.render();
  }
}
