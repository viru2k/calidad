import { Component, OnInit } from "@angular/core";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogModule,
  DynamicDialogRef,
} from "primeng-lts/dynamicdialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AlertServiceService } from "../../../services/alert-service.service";
import { InsumoService } from "./../../../services/insumo.service";

@Component({
  selector: "app-insumo-editar",
  templateUrl: "./insumo-editar.component.html",
  styleUrls: ["./insumo-editar.component.scss"],
})
export class InsumoEditarComponent implements OnInit {
  updateDataForm: FormGroup;
  elementos: any;
  unidades: any;
  gruposAnalisis: any;
  unidad: string;
  es_nuevo;
  loading;
  selected: any;
  selectedGrupo: any;
  selectedItem: any;
  selectedForma: any;
  userData: any;

  constructor(
    public config: DynamicDialogConfig,
    private insumoService: InsumoService,
    private alertServiceService: AlertServiceService,
    public ref: DynamicDialogRef
  ) {
    this.updateDataForm = new FormGroup({
      id: new FormControl(""),
      nombre: new FormControl("", Validators.required),
      descripcion: new FormControl("", Validators.required),
      unidad_descripcion: new FormControl(""),
      unidad_id: new FormControl("1"),
      grupo_analisis_id: new FormControl("1"),
      usuario_modifica_id: new FormControl(""),
      cantidad_unitaria: new FormControl("0"),
      cantidad_empaque: new FormControl("0"),
      precio_unitario: new FormControl("0"),
      precio_empaque: new FormControl("0"),
      stock_minimo: new FormControl("0"),
      stock_promedio: new FormControl("0"),
      stock_maximo: new FormControl("0"),
      selected: new FormControl(null),
      selectedGrupo: new FormControl(null),
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
    this.loadUnidad();
    this.loadGrupoAnalisis();
  }

  loadUnidad() {
    this.loading = true;
    try {
      this.insumoService.getUnidad().subscribe(
        (resp) => {
          this.unidades = resp;
          console.log(this.unidades);
          this.loading = false;
          console.log(resp);

          if (this.config.data) {
            //   this.selected =  this.unidades.find(x => x.id === this.config.data.unidad_id);
            this.updateDataForm.patchValue({
              selected: this.unidades.find(
                (x) => x.id === this.config.data.unidad_id
              ),
            });
            console.log(this.selected);
          } else {
            this.updateDataForm.patchValue({
              selected: this.unidades.find((x) => x.id === 1),
            }); // PARA QUE TOME EL VALOR DE LA PRIMERA UNIDAD EN ESTE CASO INSUMOS
            console.log(this.selected);
          }
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

  loadGrupoAnalisis() {
    this.loading = true;
    try {
      this.insumoService.getGrupoAnalisis().subscribe(
        (resp) => {
          this.gruposAnalisis = resp;
          console.log(this.gruposAnalisis);
          this.loading = false;
          console.log(resp);

          if (this.config.data) {
            this.updateDataForm.patchValue({
              selectedGrupo: this.gruposAnalisis.find(
                (x) => x.id === this.config.data.grupo_analisis_id
              ),
            });
            console.log(this.selectedGrupo);
          } else {
            this.updateDataForm.patchValue({
              selectedGrupo: this.gruposAnalisis.find((x) => x.id === 1),
            }); // PARA QUE TOME EL VALOR DE LA PRIMERA UNIDAD EN ESTE CASO INSUMOS
            console.log(this.selectedGrupo);
          }
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

  onChangeGrupo() {
    //console.log(e.target.value);
    console.log(this.updateDataForm.value.selected);
  }

  onChangeGrupoAnalisis() {
    //console.log(e.target.value);
    console.log(this.updateDataForm.value.selectedGrupo);
  }

  guardarDatos() {
    if (this.es_nuevo) {
      this.loading = true;
      try {
        this.updateDataForm.patchValue({
          usuario_modifica_id: this.userData["id"],
        });
        this.insumoService.setInsumo(this.updateDataForm.value).subscribe(
          (resp) => {
            this.loading = false;
            console.log(resp);
            this.ref.close();
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
    } else {
      this.updateDataForm.patchValue({
        usuario_modifica_id: this.userData["id"],
      });
      this.updateDataForm.patchValue({
        unidad_id: this.updateDataForm.value.selected.id,
      });
      this.updateDataForm.patchValue({
        grupo_analisis_id: this.updateDataForm.value.selectedGrupo.id,
      });
      console.log(this.updateDataForm.value);
      console.log(this.updateDataForm);
      try {
        this.insumoService
          .updateInsumo(
            this.updateDataForm.value,
            this.updateDataForm.value["id"]
          )
          .subscribe(
            (resp) => {
              this.loading = false;
              console.log(resp);
              this.ref.close();
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
}
