import { Component, OnInit } from "@angular/core";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogModule,
  DynamicDialogRef,
} from "primeng-lts/dynamicdialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ArticuloService } from "./../../../services/articulo.service";
import { AlertServiceService } from "../../../services/alert-service.service";
@Component({
  selector: "app-articulo-editar",
  templateUrl: "./articulo-editar.component.html",
  styleUrls: ["./articulo-editar.component.scss"],
})
export class ArticuloEditarComponent implements OnInit {
  updateDataForm: FormGroup;
  elementos: any;
  unidades: any;
  unidad: string;
  es_nuevo;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;

  // tslint:disable-next-line: max-line-length
  constructor(
    public config: DynamicDialogConfig,
    private articuloService: ArticuloService,
    private alertServiceService: AlertServiceService,
    public ref: DynamicDialogRef
  ) {
    this.updateDataForm = new FormGroup({
      nombre: new FormControl("", Validators.required),
      unidad_descripcion: new FormControl(""),
      descripcion: new FormControl(""),
      unidad_id: new FormControl("1"),
      unidades: new FormControl("1"),
      pallet_pisos: new FormControl("1"),
      pallet_pack: new FormControl("1"),
      unidad_hora: new FormControl("1"),
      volumen: new FormControl("1"),
      id: new FormControl(""),
      usuario_modifica_id: new FormControl("1"),
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
  }

  loadUnidad() {
    this.loading = true;
    try {
      this.articuloService.getUnidad().subscribe(
        (resp) => {
          this.unidades = resp;
          console.log(this.unidades);
          this.loading = false;
          console.log(resp);
          if (this.config.data) {
            this.selectedForma = this.unidades.find(
              (x) => x.id === this.config.data.unidad_id
            );
            this.updateDataForm.patchValue(this.config.data);
            console.log(this.selectedForma);
            this.updateDataForm.patchValue({
              unidad_id: this.selectedForma.id,
            });
            this.updateDataForm.patchValue({
              unidad_descripcion: this.selectedForma.descripcion,
            });
            console.log(this.updateDataForm.value);
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

  guardarDatos() {
    this.updateDataForm.patchValue({ usuario_modifica_id: this.userData.id });
    if (this.es_nuevo) {
      this.loading = true;
      try {
        this.articuloService.setArticulo(this.updateDataForm.value).subscribe(
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
      console.log(this.updateDataForm.value["id"]);
      this.updateDataForm.patchValue({ unidad_id: this.selectedForma.id });
      this.updateDataForm.patchValue({
        unidad_descripcion: this.selectedForma.descripcion,
      });
      console.log(this.updateDataForm);
      try {
        this.articuloService
          .updateArticulo(
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
