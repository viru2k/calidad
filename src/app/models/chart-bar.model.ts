import { DataSet } from './chart-bar-data-set.model';
export class ChartBarModel {

  labels: string[];
  datasets: DataSet[];


  constructor(
    labels: string[],
    datasets: DataSet[]
  ) {
    this.labels = labels;
    this.datasets = datasets;
  }
}
