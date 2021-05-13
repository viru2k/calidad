import { LineDataSet } from './chart-line-data-set.model';

export class ChartLineModel {

  labels: string[];
  datasets: LineDataSet[];


  constructor(
    labels: string[],
    datasets: LineDataSet[]
  ) {
    this.labels = labels;
    this.datasets = datasets;
  }
}
