import { Component, OnInit } from "@angular/core";
import { MessageService, MenuItem } from "primeng-lts/api";
import { DialogService } from "primeng-lts/dynamicdialog";

import { CalidadService } from "./../../../../services/calidad.service";
import { PopupControlEncabezadoComponent } from "./popup-control-encabezado/popup-control-encabezado.component";
import { AlertServiceService } from "./../../../../services/alert-service.service";

@Component({
  selector: "app-calidad-control-encabezado",
  templateUrl: "./calidad-control-encabezado.component.html",
  styleUrls: ["./calidad-control-encabezado.component.scss"],
})
export class CalidadControlEncabezadoComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;
  // breadcrumb
  home: MenuItem = { icon: "pi pi-home", routerLink: "/" };
  breadCrumbItems: MenuItem[];

  constructor(
    private calidadService: CalidadService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService
  ) {
    this.breadCrumbItems = [
      this.home,
      { label: "Auditoria" },
      { label: "Indicadores" },
      { label: "Controles Realizados" },
    ];
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

    const ref = this.dialogService.open(PopupControlEncabezadoComponent, {
      data,
      header: "Editar control de calidad",
      width: "60%",
      height: "50%",
    });

    ref.onClose.subscribe((PopupControlEncabezadoComponent: any) => {
      this.loadlist();
    });
  }

  nuevo() {
    const data: any = null;

    const ref = this.dialogService.open(PopupControlEncabezadoComponent, {
      data,
      header: "Crear control de calidad",
      width: "60%",
      height: "50%",
    });

    ref.onClose.subscribe((response: any) => {
      if (!!response) {
        this.loadlist();
      }
    });
  }
}
