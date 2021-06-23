import { Component, OnInit } from "@angular/core";
import { InsumoService } from "../../../services/insumo.service";
import { AlertServiceService } from "../../../services/alert-service.service";
import { MessageService, DialogService } from "primeng/api";
import { UnidadEditarComponent } from "./../unidad-editar/unidad-editar.component";

@Component({
  selector: "app-unidad",
  templateUrl: "./unidad.component.html",
  styleUrls: ["./unidad.component.scss"],
})
export class UnidadComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(
    private insumoService: InsumoService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.cols = [
      { field: "descripcion", header: "Unidad", width: "80%" },
      { field: "", header: "Acción", width: "20%" },
    ];
  }

  ngOnInit() {
    console.log("cargando insumo");
    this.loadlist();
  }

  loadlist() {
    this.loading = true;
    try {
      this.insumoService.getUnidad().subscribe(
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

  buscar(elemento: any) {
    console.log(elemento);
    const data: any = elemento;

    const ref = this.dialogService.open(UnidadEditarComponent, {
      data,
      header: "Editar Unidad",
      width: "60%",
      height: "50%",
    });

    ref.onClose.subscribe((response: any) => {
      if (!!response) {
        this.loadlist();
      }
    });
  }

  nuevo() {
    const data: any = null;

    const ref = this.dialogService.open(UnidadEditarComponent, {
      data,
      header: "Crear Unidad",
      width: "60%",
      height: "50%",
    });

    ref.onClose.subscribe((UnidadEditarComponent: any) => {
      if (UnidadEditarComponent) {
        this.loadlist();
      }
    });
  }
}
