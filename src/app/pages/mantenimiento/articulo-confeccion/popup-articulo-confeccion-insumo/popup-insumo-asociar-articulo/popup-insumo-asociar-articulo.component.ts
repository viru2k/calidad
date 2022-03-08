import { Component, OnInit } from "@angular/core";
import { AlertServiceService } from "./../../../../../services/alert-service.service";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogModule,
  DynamicDialogRef,
} from "primeng-lts/dynamicdialog";
import { InsumoService } from "./../../../../../services/insumo.service";
import { ArticuloService } from "../../../../../services/articulo.service";
import { Filter } from "../../../../../shared/filter";

@Component({
  selector: "app-popup-insumo-asociar-articulo",
  templateUrl: "./popup-insumo-asociar-articulo.component.html",
  styleUrls: ["./popup-insumo-asociar-articulo.component.scss"],
})
export class PopupInsumoAsociarArticuloComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  cantidad = 0;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(
    private alertServiceService: AlertServiceService,
    private insumoService: InsumoService,
    private articuloService: ArticuloService,
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private filter: Filter
  ) {
    this.cols = [
      { field: "nombre", header: "Insumo", width: "40%" },
      { field: "descripcion", header: "Descripción", width: "30%" },
      { field: "unidad_descripcion", header: "Unidad", width: "20%" },
      { field: "", header: "", width: "10%" },
    ];
  }

  ngOnInit() {
    // this.alertServiceService.throwAlert('success','Articulo guardado','','201');
    console.log(this.config.data);
    if (this.config.data) {
      if (Number(this.config.data["cantidad"]) >= 0) {
        this.cantidad = Number(this.config.data["cantidad"]);
      }
    }

    this.loadlist();
  }

  loadlist() {
    this.loading = true;
    try {
      this.insumoService.getInsumo().subscribe(
        (resp) => {
          if (resp) {
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
    console.log(elemento);
    if (Number(this.cantidad) >= 0) {
      elemento["cantidad"] = this.cantidad;
      elemento["articulo_id"] = this.config.data["id"];
      elemento["insumo_id"] = elemento["id"];
      console.log(elemento);

      try {
        this.articuloService.setArticuloConfeccion(elemento).subscribe(
          (resp) => {
            if (resp) {
              this.ref.close();
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
    } else {
      this.alertServiceService.throwAlert(
        "warning",
        "Error: " + +"  La cantidad debe ser al menos 0",
        "",
        "500"
      );
    }
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
