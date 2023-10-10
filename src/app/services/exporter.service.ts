import { Injectable } from "@angular/core";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { formatDate } from "@angular/common";
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Injectable({
  providedIn: "root",
})
export class ExporterService {
  constructor() {}

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const wb = XLSX.utils.book_new();
    //XLSX.utils.book_append_sheet(wb, ws, "SheetJS1");
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exporManyPagestAsExcelFile(
    json: any[],
    excelFileName: string,
    sheets: string[]
  ): void {
    /*  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { sheets: worksheet },
      SheetNames: sheets,
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    }); */

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(json),
      "sdfasdf 1"
    );
    XLSX.utils.book_append_sheet(wb, json[1], "sdfasdf 2");
    //XLSX.writeFile(wb, "sararasa.xlsx");
    const excelBuffer: any = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
    let i = 0;
    /*  json.forEach((resp) => {
      XLSX.utils.book_append_sheet(wb, resp, sheets[i]);
      console.log("json content ", resp);
      console.log("sheet", sheets[i]);
      XLSX.writeFile(wb, excelFileName + ".xlsx");
      i++;
    }); */ // this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const fecha = formatDate(new Date(), "dd-MM-yyyy-HH-mm", "es-Ar");
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + fecha + EXCEL_EXTENSION);
  }
}
