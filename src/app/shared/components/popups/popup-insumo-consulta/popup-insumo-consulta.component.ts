import { Component, OnInit } from "@angular/core";

import { DynamicDialogRef } from "primeng-lts/dynamicdialog";
import { ArticuloService } from "./../../../../services/articulo.service";
import { AlertServiceService } from "./../../../../services/alert-service.service";
import { InsumoService } from "./../../../../services/insumo.service";
import { Filter } from "../../../filter";

@Component({
  selector: "app-popup-insumo-consulta",
  templateUrl: "./popup-insumo-consulta.component.html",
  styleUrls: ["./popup-insumo-consulta.component.scss"],
})
export class PopupInsumoConsultaComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;

  constructor(
    private alertServiceService: AlertServiceService,
    private insumoService: InsumoService,
    public ref: DynamicDialogRef,
    private filter: Filter
  ) {
    this.cols = [
      { field: "nombre", header: "Insumo", width: "30%" },
      { field: "descripcion", header: "Descripción", width: "40%" },
      { field: "unidad_descripcion", header: "Unidad", width: "20%" },
      { field: "", header: "", width: "10%" },
    ];
  }

  ngOnInit() {
    // this.alertServiceService.throwAlert('success','Articulo guardado','','201');
    this.loadlist();
  }

  loadlist() {
    this.loading = true;
    try {
      this.insumoService.getInsumo().subscribe(
        (resp) => {
          if (resp[0]) {
            this.elementos = resp;
            console.log(this.elementos);
          } else {
            this.elementos = null;
          }
          this.loading = false;
          console.log(resp);
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
      this.alertServiceService.throwAlert(
        "error",
        "Error: " + error.status + "  Error al cargar los registros",
        "",
        "500"
      );
    }
  }

  guardar(elemento) {
    this.ref.close(elemento);
  }

  _nombre: any[] = [];
  realizarFiltroBusqueda(resp: any[]) {
    // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
    this._nombre = [];
    resp.forEach((element) => {
      this._nombre.push(element.nombre);
    });
    // ELIMINO DUPLICADOS
    this._nombre = this.filter.filterArray(this._nombre);
  }
}
