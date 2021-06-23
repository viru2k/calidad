import { Component, OnInit } from "@angular/core";
import { AlertServiceService } from "../../../services/alert-service.service";
import { ArticuloService } from "./../../../services/articulo.service";
import { MessageService, DialogService } from "primeng/api";
import { ArticuloConfeccionEditarComponent } from "./../articulo-confeccion-editar/articulo-confeccion-editar.component";
import { PopupArticuloConfeccionInsumoComponent } from "./popup-articulo-confeccion-insumo/popup-articulo-confeccion-insumo.component";

@Component({
  selector: "app-articulo-confeccion",
  templateUrl: "./articulo-confeccion.component.html",
  styleUrls: ["./articulo-confeccion.component.scss"],
  providers: [MessageService, DialogService],
})
export class ArticuloConfeccionComponent implements OnInit {
  cols: any[];
  colsConfeccion: any[];
  columns: any[];
  elementos: any[];
  elementosConfeccion: any[];
  selecteditems: any;
  loading;
  elemento: any;

  // tslint:disable-next-line: max-line-length
  constructor(
    private alertServiceService: AlertServiceService,
    private articuloService: ArticuloService,
    public dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.cols = [
      { field: "descripcion", header: "Producto", width: "40%" },
      { field: "unidad_descripcion", header: "Unidad", width: "20%" },
      { field: "unidades", header: "Unidades", width: "10%" },
      { field: "pallet_pisos", header: "Pisos", width: "10%" },
      { field: "pallet_pack", header: "Pack", width: "10%" },
      { field: "volumen", header: "Volumen", width: "10%" },
      { field: "", header: "", width: "6%" },
    ];
  }

  ngOnInit() {
    this.loadlist();
  }

  loadlist() {
    this.loading = true;
    try {
      this.articuloService.getArticulo().subscribe(
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

  loadlistConfeccion(_elemento: any) {
    this.elemento = _elemento;
    console.log(_elemento);

    let data: any;
    data = this.elemento;
    console.log(data);
    if (data) {
      const ref = this.dialogService.open(
        PopupArticuloConfeccionInsumoComponent,
        {
          data,
          header: "Agregar insumo",
          width: "98%",
          height: "90%",
        }
      );

      ref.onClose.subscribe((PopupArticuloConfeccionInsumoComponent: any) => {
        if (PopupArticuloConfeccionInsumoComponent) {
          console.log(PopupArticuloConfeccionInsumoComponent);
        }
      });
    }
  }

  editarInsumo(elemento: any) {
    console.log(elemento);

    let data: any;
    data = elemento;
    const ref = this.dialogService.open(ArticuloConfeccionEditarComponent, {
      data,
      header: "Editar insumos de artículo",
      width: "98%",
      height: "90%",
    });

    ref.onClose.subscribe(() => {
      this.loadlistConfeccion(elemento["articulo_id"]);
    });
  }

  guardarArticuloInsumo(_elemento) {
    this.loading = true;
    try {
      this.articuloService.setArticuloConfeccion(_elemento).subscribe(
        (resp) => {
          this.elementosConfeccion = resp;
          console.log(this.elementosConfeccion);

          this.loading = false;
          console.log(resp);
          this.loadlistConfeccion(this.elemento);
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
}
