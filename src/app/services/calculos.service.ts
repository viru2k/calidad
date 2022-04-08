import { Injectable } from "@angular/core";
import { Chart } from "../models/chart.model";
@Injectable({
  providedIn: "root",
})
export class CalculosService {
  chart: Chart;
  data: Chart[] = [];

  parametrizarY(y: any[]): any[] {
    this.data = [];
    this.chart = null;
    console.log(y);
    y.forEach((element) => {
      console.log(element);
      this.chart = new Chart("", element);
      this.data.push(this.chart);
    });
    console.log(this.data);
    return this.data;
  }

  parametrizarXY(xy: any[]): any[] {
    this.data = [];
    this.chart = null;
    //console.log(y);
    xy.forEach((element) => {
      //    console.log(element);
      this.chart = { x: element.x, y: element.y };
      this.data.push(this.chart);
    });
    console.log(this.data);
    return this.data;
  }

  tienePermiso(permiso: string, permisos: any[]): boolean {
    const found = permisos.find((x) => x.modulo_nombre === permiso);

    if (!!found) {
      return true;
    }
    return false;
  }
}
