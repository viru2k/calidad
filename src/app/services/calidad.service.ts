import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS, PARAMS } from "../config/config";
import { ControCalidadParametroValor } from "../models/control-calidad-parametro-valor.model";

@Injectable({
  providedIn: "root",
})
export class CalidadService {
  private url: string = URL_SERVICIOS;
  constructor(public http: HttpClient) {}

  /* -------------------------------------------------------------------------- */
  /*                   ENCABEZADO DE LAS PLANILLAS DE CALIDAD                   */
  /* -------------------------------------------------------------------------- */

  getCalidadControlEncabezado() {
    return this.http.get<any[]>(this.url + "calidad/control/encabezado");
  }

  setCalidadControlEncabezado(articulo: any) {
    return this.http.post<any[]>(
      this.url + "calidad/control/encabezado",
      articulo
    );
  }

  putCalidadControlEncabezado(articulo: any, id: string) {
    return this.http.put<any[]>(
      this.url + "calidad/control/encabezado/" + id,
      articulo
    );
  }

  getCalidadControlParametros() {
    return this.http.get<any[]>(this.url + "calidad/control/parametros");
  }

  setCalidadControlParametros(articulo: any) {
    return this.http.post<any[]>(
      this.url + "calidad/control/parametros",
      articulo
    );
  }

  putCalidadControlParametros(articulo: any, id: string) {
    return this.http.put<any[]>(
      this.url + "calidad/control/parametros/" + id,
      articulo
    );
  }

  getCalidadControlParametroControl(id: string) {
    return this.http.get<any[]>(
      this.url +
        "calidad/control/parametros/control/by/id?control_calidad_id=" +
        id
    );
  }

  setCalidadControlParametroControl(articulo: any) {
    return this.http.post<any[]>(
      this.url + "calidad/control/parametros/control/by/id",
      articulo
    );
  }

  putCalidadControlParametroControl(articulo: any, id: string) {
    return this.http.put<any[]>(
      this.url + "calidad/control/parametros/control/by/id/" + id,
      articulo
    );
  }

  getControlesDetalleByIdProduccion(id: string) {
    return this.http.get<any[]>(
      this.url +
        "calidad/control/detalle/by/proceso/controles?produccion_proceso_id=" +
        id
    );
  }

  getControlesDetalleByIdControl(id: number, calidad_control_id: number) {
    return this.http.get<any[]>(
      this.url +
        "calidad/control/detalle/by/proceso/controles/id?produccion_proceso_id=" +
        id +
        "&calidad_control_id=" +
        calidad_control_id
    );
  }

  getControlesByIdProduccion(id: string) {
    return this.http.get<any[]>(
      this.url +
        "calidad/control/by/proceso/controles?produccion_proceso_id=" +
        id
    );
  }

  getControlByProcesoId(id: string) {
    return this.http.get<any[]>(
      this.url + "calidad/control/by/proceso/id?produccion_proceso_id=" + id
    );
  }

  getControlByProcesoByDates(fechaDesde: string, fechaHasta: string) {
    return this.http.get<any[]>(
      this.url +
        "calidad/control/by/dates?fecha_desde=" +
        fechaDesde +
        "&fecha_hasta=" +
        fechaHasta
    );
  }

  getDesviacionesParametroCalidadByProcesoByDates(
    fechaDesde: string,
    fechaHasta: string
  ) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any[]>(
      this.url +
        "calidad/control/desviacion/parametro/proceso/by/dates?fecha_desde=" +
        fechaDesde +
        "&fecha_hasta=" +
        fechaHasta
    );
  }

  delControlParametro(id: string) {
    return this.http.delete<any>(this.url + "calidad/control/proceso?id=" + id);
  }

  setCalidadControlParametrosValor(items: any[]) {
    return this.http.post<any>(
      this.url + "calidad/control/parametros/valor",
      items
    );
  }
}
