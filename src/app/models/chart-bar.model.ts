import { DataSet } from './DataSet.model';
export class ChartBar {

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
