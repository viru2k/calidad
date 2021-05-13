import { LineDataSet } from './../../../models/chart-line-data-set.model';



import { Filter } from './../../filter';
import { AlertServiceService } from './../../../services/alert-service.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DialogService, MessageService, DynamicDialogConfig } from 'primeng/api';
import { ExporterService } from '../../../services/exporter.service';
import { Chart } from 'chart.js';
import { formatDate, DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-popup-chart-line',
  templateUrl: './popup-chart-line.component.html',
  styles: [],
})
export class PopupChartLineComponent implements OnInit, AfterViewInit {
  @ViewChild('lineCanvas', { static: false }) private lineCanvas: ElementRef;
  lineChart: any;
  data: any;
  dataString:number[] = [];
  lineData: LineDataSet;
  _labels: string[] = [];
  _dataSet:  number[] = [];

  constructor(private alertServiceService: AlertServiceService,
    private decimalPipe: DecimalPipe,
    public dialogService: DialogService,
    private messageService: MessageService,
    private config: DynamicDialogConfig,
    private exporterService: ExporterService,
    private filter: Filter) {


  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.lineChartBrowser();
  }


  lineChartBrowser(){

    console.log(this.config.data);
    this.config.data.forEach(element => {
      this._labels.push(formatDate(new Date(element.fecha_produccion), 'EEEE dd/MM/yyyy', 'es-Ar'));
     // this._dataSet.push( Number(this.decimalPipe.transform(element.unidad_hora,"1.2-2")));
      this._dataSet.push( element.unidad_hora);
    });
    this.lineData = new LineDataSet(this._dataSet, 'DATOS DE PRODUCCION' );
    console.log(this._labels.length);
    console.log(this._dataSet.length);
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this._labels,
        datasets: this.lineData.datasets
      }
    });


  }

  selectData(event) {
    this.messageService.add({severity: 'info', summary: 'Data Selected', 'detail': this.data.datasets[event.element._datasetIndex].data[event.element._index]});
}

}

  /*   this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Apple', 'Google', 'Facebook', 'Infosys', 'Hp', 'Accenture'],
        datasets: [{
          backgroundColor: [
            '#2ecc71',
            '#3498db',
            '#95a5a6',
            '#9b59b6',
            '#f1c40f',
            '#e74c3c'
          ],
          data: [12, 19, 3, 17, 28, 24]
        }]
      }
    }); */
