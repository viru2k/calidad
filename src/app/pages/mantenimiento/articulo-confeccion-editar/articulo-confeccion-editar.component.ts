import { Component, OnInit } from "@angular/core";
import { AlertServiceService } from "../../../services/alert-service.service";
import { ArticuloService } from "./../../../services/articulo.service";
import { MessageService } from "primeng-lts/api";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogModule,
  DynamicDialogRef,
} from "primeng-lts/dynamicdialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PopupInsumoConsultaComponent } from "./../../../shared/components/popups/popup-insumo-consulta/popup-insumo-consulta.component";
@Component({
  selector: "app-articulo-confeccion-editar",
  templateUrl: "./articulo-confeccion-editar.component.html",
  styleUrls: ["./articulo-confeccion-editar.component.scss"],
  providers: [MessageService, DialogService],
})
export class ArticuloConfeccionEditarComponent implements OnInit {
  updateDataForm: FormGroup;
  elementos: any;
  unidades: any;
  unidad: string;
  es_nuevo;
  loading;
  selectedItem: any;
  selectedForma: any;

  constructor(
    private alertServiceService: AlertServiceService,
    private articuloService: ArticuloService,
    public dialogService: DialogService,
    private config: DynamicDialogConfig,
    private messageService: MessageService,
    public ref: DynamicDialogRef
  ) {
    this.updateDataForm = new FormGroup({
      descripcion: new FormControl(""),
      articulo_id: new FormControl("0"),
      insumo_id: new FormControl("0"),
      cantidad: new FormControl("1"),
      VOLUMEN: new FormControl("1"),
      id: new FormControl(""),
      unidad: new FormControl("0"),
    });
  }

  ngOnInit() {
    console.log(this.config.data);
    this.updateDataForm.patchValue({ articulo_id: this.config.data.id });
  }

  loadlist() {
    this.loading = true;
    try {
      this.articuloService.getArticulo().subscribe(
        (resp) => {
          this.elementos = resp;
          console.log(this.elementos);

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

  buscarInsumo() {
    let data: any;
    const ref = this.dialogService.open(PopupInsumoConsultaComponent, {
      data,
      header: "Buscar insumo",
      width: "95%",
      height: "90%",
    });

    ref.onClose.subscribe((PopupInsumoConsultaComponent: any) => {
      if (PopupInsumoConsultaComponent) {
        console.log(PopupInsumoConsultaComponent);
        //  this.config.data = this.updateDataForm.value;
        this.updateDataForm.patchValue({
          insumo_id: PopupInsumoConsultaComponent.id,
        });
        this.updateDataForm.patchValue({
          descripcion: PopupInsumoConsultaComponent.descripcion,
        });
      }
    });
  }

  guardarDatos() {
    // console.log(this.updateDataForm.value);
    this.ref.close(this.updateDataForm.value);
  }
}
