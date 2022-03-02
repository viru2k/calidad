import { Component, OnInit, ɵConsole } from "@angular/core";
import { ProduccionService } from "../../../services/produccion.service";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogModule,
  DynamicDialogRef,
} from "primeng-lts/dynamicdialog";
import { AlertServiceService } from "./../../../services/alert-service.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { InsumoService } from "../../../services/insumo.service";

@Component({
  selector: "app-grupo-analisis-editar",
  templateUrl: "./grupo-analisis-editar.component.html",
  styleUrls: ["./grupo-analisis-editar.component.scss"],
})
export class GrupoAnalisisEditarComponent implements OnInit {
  updateDataForm: FormGroup;
  elementos: any;
  unidades: any;
  unidad: string;
  es_nuevo;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;

  constructor(
    public config: DynamicDialogConfig,
    private produccionService: InsumoService,
    private alertServiceService: AlertServiceService,
    public ref: DynamicDialogRef
  ) {
    this.updateDataForm = new FormGroup({
      id: new FormControl(""),
      grupo_nombre: new FormControl("", Validators.required),
      color: new FormControl("", Validators.required),
    });
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.config.data);
    if (this.config.data) {
      console.log("es editable");
      this.es_nuevo = false;
      this.updateDataForm.patchValue(this.config.data);
    } else {
      this.es_nuevo = true;
      console.log("es nuevo");
    }
  }

  guardarDatos() {
    if (this.es_nuevo) {
      this.nuevaUnidad();
    } else {
      this.editarUnidad();
    }
  }

  nuevaUnidad() {
    this.loading = true;
    console.log("guardando");
    try {
      this.produccionService
        .setGrupoAnalisis(this.updateDataForm.value)
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
    console.log(this.updateDataForm);
    try {
      this.produccionService
        .putGrupoAnalisis(
          this.updateDataForm.value.id,
          this.updateDataForm.value
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
