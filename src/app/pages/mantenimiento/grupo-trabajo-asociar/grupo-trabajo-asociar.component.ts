import { Component, OnInit } from "@angular/core";
import { PopupUsuarioComponent } from "./../../../shared/components/popups/popup-usuario/popup-usuario.component";
import { SectorService } from "./../../../services/sector.service";
import { AlertServiceService } from "./../../../services/alert-service.service";
import { MessageService } from "primeng-lts/api";
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from "primeng-lts/dynamicdialog";
import { config } from "../../../config/config";

@Component({
  selector: "app-grupo-trabajo-asociar",
  templateUrl: "./grupo-trabajo-asociar.component.html",
  styleUrls: ["./grupo-trabajo-asociar.component.scss"],
})
export class GrupoTrabajoAsociarComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(
    public config: DynamicDialogConfig,
    private sectorService: SectorService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.cols = [
      { field: "email", header: "Usuario", width: "40%" },
      { field: "nombreyapellido", header: "Nombre y apellido", width: "40%" },
      { field: "", header: "Acción", width: "20%" },
    ];
  }

  ngOnInit() {
    console.log("cargando insumo");
    this.loadlist();
  }

  loadlist() {
    console.log(this.config.data.id);
    this.loading = true;
    try {
      this.sectorService.getGrupoByIdGrupo(this.config.data.id).subscribe(
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

  nuevo() {
    const data: any = null;

    const ref = this.dialogService.open(PopupUsuarioComponent, {
      data,
      header: "Agregar usuario a grupo",
      width: "80%",
      height: "70%",
    });

    ref.onClose.subscribe((PopupUsuarioComponent: any) => {
      console.log(PopupUsuarioComponent);
      if (PopupUsuarioComponent) {
        this.asociarUsuario(PopupUsuarioComponent);
      }
    });
  }

  asociarUsuario(usuario: any) {
    usuario.usuario_id = usuario.id;
    usuario.grupo_id = this.config.data.id;
    console.log(this.config.data.id);
    this.loading = true;
    try {
      this.sectorService.setGrupoTrabajo(usuario).subscribe(
        (resp) => {
          if (resp[0]) {
            this.elementos = resp;
            console.log(this.elementos);
          } else {
            this.elementos = null;
          }
          this.loading = false;
          console.log(resp);
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

  eliminar(elemento) {
    this.loading = true;
    try {
      this.sectorService.delGrupoUsuario(elemento.grupo_trabajo_id).subscribe(
        (resp) => {
          if (resp[0]) {
            this.elementos = resp;
            console.log(this.elementos);
          } else {
            this.elementos = null;
          }
          this.loading = false;
          console.log(resp);
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
