import { Component, OnInit } from "@angular/core";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogModule,
  DynamicDialogRef,
} from "primeng-lts/dynamicdialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CalidadService } from "./../../../../../services/calidad.service";
import { AlertServiceService } from "./../../../../../services/alert-service.service";

@Component({
  selector: "app-popup-control-parametro",
  templateUrl: "./popup-control-parametro.component.html",
  styleUrls: ["./popup-control-parametro.component.scss"],
})
export class PopupControlParametroComponent implements OnInit {
  updateDataForm: FormGroup;
  elementos: any;
  unidades: any;
  unidad: string;
  es_nuevo;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;
  esActivo = true;
  rating = 3;
  rating_msg = "";
  opciones: any[] = [];
  selectedOpcion: string = "NUMERO";

  constructor(
    public config: DynamicDialogConfig,
    private calidadService: CalidadService,
    private alertServiceService: AlertServiceService,
    public ref: DynamicDialogRef
  ) {
    this.updateDataForm = new FormGroup({
      id: new FormControl(""),
      parametro: new FormControl("", Validators.required),
      control_tipo: new FormControl("", Validators.required),
      estado: new FormControl("true", Validators.required),
    });

    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.config.data);
    if (this.config.data) {
      console.log("es editable");
      this.es_nuevo = false;
      this.updateDataForm.patchValue(this.config.data);
      this.updateDataForm.patchValue({ parametro: this.config.data.parametro });

      if (this.config.data.estado === "ACTIVO") {
        this.esActivo = true;
      } else {
        this.esActivo = false;
      }
      this.updateDataForm.patchValue({ estado: this.esActivo });
      console.log(this.updateDataForm.value);
    } else {
      this.es_nuevo = true;
      console.log("es nuevo");
    }

    this.opciones = [
      { name: "NUMERO", value: "NUMERO" },
      { name: "RANKING", value: "RANKING" },
      { name: "OPCION", value: "OPCION" },
      { name: "TIEMPO", value: "TIEMPO" },
    ];
  }

  ngOnInit() {}

  handleRate(event) {
    this.rating_msg = "You have rated " + event.value;
  }

  onChangeOpcion(event) {
    console.log(event.target.value);

    //this.updateDataForm.patchValue({});
  }

  changeEstado(event) {
    console.log(this.updateDataForm.value);
  }

  guardarDatos() {
    if (this.es_nuevo) {
      this.nuevaUnidad();
    } else {
      this.editarUnidad();
    }
  }

  guardarEstado() {
    if (this.updateDataForm.value.estado === true) {
      this.updateDataForm.patchValue({ estado: "ACTIVO" });
    } else {
      this.updateDataForm.patchValue({ estado: "INACTIVO" });
    }
  }

  nuevaUnidad() {
    this.loading = true;
    this.updateDataForm.patchValue({ estado: "ACTIVO" });
    try {
      this.calidadService
        .setCalidadControlParametros(this.updateDataForm.value)
        .subscribe(
          (resp) => {
            this.loading = false;
            console.log(resp);
            this.ref.close(resp);
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

  editarUnidad() {
    this.guardarEstado();
    console.log(this.updateDataForm);
    try {
      this.calidadService
        .putCalidadControlParametros(
          this.updateDataForm.value,
          this.updateDataForm.value.id
        )
        .subscribe(
          (resp) => {
            this.loading = false;
            console.log(resp);
            this.ref.close(resp);
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
