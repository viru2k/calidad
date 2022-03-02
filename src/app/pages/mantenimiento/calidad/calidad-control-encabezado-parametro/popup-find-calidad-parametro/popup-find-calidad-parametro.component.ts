import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng-lts/api";
import { DialogService, DynamicDialogRef } from "primeng-lts/dynamicdialog";
import { AlertServiceService } from "./../../../../../services/alert-service.service";
import { CalidadService } from "./../../../../../services/calidad.service";
import swal from "sweetalert2";

@Component({
  selector: "app-popup-find-calidad-parametro",
  templateUrl: "./popup-find-calidad-parametro.component.html",
  styleUrls: ["./popup-find-calidad-parametro.component.scss"],
})
export class PopupFindCalidadParametroComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;
  parametroMaximo = 0;
  parametroMinimo = 0;

  constructor(
    private calidadService: CalidadService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private messageService: MessageService,
    public ref: DynamicDialogRef
  ) {
    this.cols = [
      { field: "parametro", header: "Parámetro", width: "80%" },
      { field: "", header: "Acción", width: "20%" },
    ];
  }

  ngOnInit() {
    console.log("cargando insumo");
    this.loadlist();
  }

  minimo(event) {
    console.log(event.target.value);
    this.parametroMinimo = Number(event.target.value);
  }

  maximo(event) {
    console.log(event.target.value);
    this.parametroMaximo = Number(event.target.value);
  }

  loadlist() {
    this.loading = true;
    try {
      this.calidadService.getCalidadControlParametros().subscribe(
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

  guardar(elemento: any) {
    console.log(elemento);
    console.log(this.parametroMaximo);
    if (this.parametroMaximo === 0 || this.parametroMinimo === 0) {
      swal({
        title: "Parametros incompletos",
        text: "¿Desea continuar?",
        showCancelButton: true,
        confirmButtonColor: "#E53935",
        cancelButtonColor: "#66BB6A",
        cancelButtonText: "Continuar",
        confirmButtonText: "Corregir",
        imageUrl: "./assets/icons/alert-icons/icon-wrong.png",
        imageHeight: 64,
        imageWidth: 64,
      }).then((result) => {
        console.log(result);
        if (result.value) {
          // SI CORRIGO DEVUELVE TRUE
        } else {
          elemento.parametro_maximo = this.parametroMaximo;
          elemento.parametro_minimo = this.parametroMinimo;
          this.ref.close(elemento);
        }
      });
    } else {
      elemento.parametro_maximo = this.parametroMaximo;
      elemento.parametro_minimo = this.parametroMinimo;
      this.ref.close(elemento);
    }
  }
}
