import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng-lts/api";
import { DialogService } from "primeng-lts/dynamicdialog";

import { CalidadService } from "./../../../../services/calidad.service";
import { AlertServiceService } from "./../../../../services/alert-service.service";
import { PopupCalidadControlEncabezadoParametroComponent } from "./popup-calidad-control-encabezado-parametro/popup-calidad-control-encabezado-parametro.component";

@Component({
  selector: "app-calidad-control-encabezado-parametro",
  templateUrl: "./calidad-control-encabezado-parametro.component.html",
  styleUrls: ["./calidad-control-encabezado-parametro.component.scss"],
})
export class CalidadControlEncabezadoParametroComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;

  constructor(
    private calidadService: CalidadService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.cols = [
      { field: "calidad_titulo", header: "Título", width: "30%" },
      { field: "calidad_descripcion", header: "Descripción", width: "40%" },
      { field: "ficha_nro", header: "Ficha", width: "20%" },
      { field: "", header: "Acción", width: "10%" },
    ];
  }

  ngOnInit() {
    console.log("cargando insumo");
    this.loadlist();
  }

  loadlist() {
    this.loading = true;
    try {
      this.calidadService.getCalidadControlEncabezado().subscribe(
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

    const ref = this.dialogService.open(
      PopupCalidadControlEncabezadoParametroComponent,
      {
        data,
        header: "Editar parámetros en control de calidad",
        width: "80%",
        height: "90%",
      }
    );

    ref.onClose.subscribe((response: any) => {
      if (!!response) {
        this.loadlist();
      }
    });
  }
}
