import { Component, OnInit } from "@angular/core";
import { PopupFindCalidadParametroComponent } from "./../popup-find-calidad-parametro/popup-find-calidad-parametro.component";
import { AlertServiceService } from "./../../../../../services/alert-service.service";
import { CalidadService } from "./../../../../../services/calidad.service";
import { MessageService } from "primeng-lts/api";
import { DialogService, DynamicDialogConfig } from "primeng-lts/dynamicdialog";

@Component({
  selector: "app-popup-calidad-control-encabezado-parametro",
  templateUrl: "./popup-calidad-control-encabezado-parametro.component.html",
  styleUrls: ["./popup-calidad-control-encabezado-parametro.component.scss"],
})
export class PopupCalidadControlEncabezadoParametroComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;
  id: string;

  constructor(
    private calidadService: CalidadService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private messageService: MessageService,
    public config: DynamicDialogConfig
  ) {
    this.cols = [
      { field: "parametro", header: "Parámetro", width: "50%" },
      { field: "parametro_minimo", header: "Mínimo", width: "16%" },
      { field: "parametro_maximo", header: "Máximo", width: "16%" },
      { field: "control_tipo", header: "Control", width: "16%" },
      { field: "estado", header: "Estado", width: "16%" },
      { field: "", header: "Acción", width: "16%" },
    ];
  }

  ngOnInit() {
    console.log(this.config.data);
    this.id = this.config.data.id;
    console.log("cargando insumo");
    this.loadlist();
  }

  loadlist() {
    this.loading = true;
    try {
      this.calidadService.getCalidadControlParametroControl(this.id).subscribe(
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

  borrar(elemento: any) {
    console.log(elemento);

    this.loading = true;
    try {
      this.calidadService.delControlParametro(elemento.id).subscribe(
        (resp) => {
          if (resp[0]) {
            this.elementos = resp;
            console.log(this.elementos);
          } else {
            this.elementos = null;
          }
          this.loading = false;
          this.loadlist();
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

  nuevo() {
    const data: any = null;

    const ref = this.dialogService.open(PopupFindCalidadParametroComponent, {
      data,
      header: "Buscar parámetros",
      width: "80%",
      height: "90%",
    });

    ref.onClose.subscribe((response: any) => {
      if (!!response) {
        console.log(response);
        this.guardar(response);
      }
    });
  }

  guardar(elemento: any) {
    console.log(elemento);
    elemento.control_calidad_id = this.id;
    elemento.parametro_id = elemento.id;
    this.loading = true;
    try {
      this.calidadService.setCalidadControlParametroControl(elemento).subscribe(
        (resp) => {
          if (resp[0]) {
            this.elementos = resp;
            console.log(this.elementos);
          } else {
            this.elementos = null;
          }
          this.loading = false;
          this.loadlist();
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
}
