export class DataSet {

  label: string;
  data: any[];
  backgroundColor: string;
  borderColor: string;



  constructor(
      label: string,
      backgroundColor: string,
      borderColor: string,
      data: any[]
  ) {
    this.label = label;
    this.backgroundColor = backgroundColor;
    this.borderColor = borderColor;
    this.data = data;
  }
}
