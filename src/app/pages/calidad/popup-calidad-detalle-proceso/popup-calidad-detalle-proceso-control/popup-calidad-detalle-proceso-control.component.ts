import { Component, OnInit } from "@angular/core";

import { calendarioIdioma } from "../../../../config/config";

import * as CanvasJS from "../../../../../assets/canvasjs.min";
import { CalculosService } from "../../../../services/calculos.service";
import { AlertServiceService } from "../../../../services/alert-service.service";
import { ProduccionService } from "../../../../services/produccion.service";
import { MessageService } from "primeng-lts/api";
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from "primeng-lts/dynamicdialog";
import { CalidadService } from "../../../../services/calidad.service";

@Component({
  selector: "app-popup-calidad-detalle-proceso-control",
  templateUrl: "./popup-calidad-detalle-proceso-control.component.html",
  styleUrls: ["./popup-calidad-detalle-proceso-control.component.scss"],
})
export class PopupCalidadDetalleProcesoControlComponent implements OnInit {
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

  // FILTROS
  //  @ViewChild('dt', { static: false }) table: Table;
  filter1: any[] = [];

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
      { field: "fecha_carga", header: "Ingresado", width: "16%" },
      { field: "parametro", header: "Parámetro", width: "20%" },
      { field: "calidad_valor", header: "Valor", width: "16%" },
      { field: "es_no_conformidad", header: "No conform.", width: "10%" },
      {
        field: "es_no_conformidad_descripcion",
        header: "Descripción",
        width: "26%",
      },
      {
        field: "tiene_accion_correctiva",
        header: "Accion correc.",
        width: "10%",
      },
      {
        field: "tiene_accion_correctiva_descripcion",
        header: "Descripción",
        width: "26%",
      },
    ];
  }

  ngOnInit() {
    this.tieneEstadistica = true;

    // console.log(this.parametrizarChart.parametrizarY());

    this.data = this.config.data;
    this.es = calendarioIdioma;
    this.fecha_desde = new Date();
    this.fecha_hasta = new Date();
    console.log(this.config.data);
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.loadProduccionDetalle();

    this.tieneEstadistica = true;
    //this.verEstadistica();
  }

  loadProduccionDetalle() {
    console.log(this.selectedElemento);
    this.loading = true;
    try {
      this.calidadService
        .getControlesDetalleByIdProduccion(this.config.data.id)
        .subscribe(
          (resp) => {
            /* ------------------------------------------------------------------------------------------------------ */
            /*             FILTRADO Y  ELIMINACION DE DUPLICADOS PARA DROPDOWN JUNTO CON LA FUNCION SQUASH            */
            /* ------------------------------------------------------------------------------------------------------ */

            const temp: any[] = [];
            resp.forEach((ele) => {
              console.log(ele.parametro);
              temp.push(ele.parametro);
            });
            this.filter1 = this.squash(temp);
            console.log(this.filter1);
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

  squash(arr) {
    // primero genero el array con elementos filtrados
    // luego genero el array con esos datos
    //genero el array para poder mostrar
    const temp: any[] = [];
    const filtrado = new Set(arr);
    console.log(filtrado);
    const resultado = [...filtrado];
    console.log(resultado);
    resultado.forEach((ele) => {
      console.log(ele);
      temp.push({ label: ele, value: ele });
    });
    return temp;
  }

  onDateSelect(value) {
    //let f = formatDate(new Date(value), 'yyyy-MM-dd HH:mm', 'en');
    //  this.table.filter(formatDate(new Date(value ), 'yyyy-MM-dd HH:m', 'en'), 'fecha_carga', 'equals');
    console.log(value);
  }

  detalle(elem: any) {}

  buscarByDates() {}

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
    // this.parametrizarChart.parametrizarY(y);
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
