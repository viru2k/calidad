import { Component, OnInit } from "@angular/core";
import { InsumoService } from "../../../services/insumo.service";
import { AlertServiceService } from "../../../services/alert-service.service";
import { MessageService, DialogService } from "primeng/api";
import { GrupoTrabajoEditarComponent } from "./../grupo-trabajo-editar/grupo-trabajo-editar.component";
import { SectorService } from "../../../services/sector.service";
import { GrupoTrabajoAsociarComponent } from "./../grupo-trabajo-asociar/grupo-trabajo-asociar.component";

@Component({
  selector: "app-grupo-trabajo",
  templateUrl: "./grupo-trabajo.component.html",
  styleUrls: ["./grupo-trabajo.component.scss"],
})
export class GrupoTrabajoComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(
    private sectorService: SectorService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.cols = [
      { field: "grupo_nombre", header: "Grupo", width: "60%" },
      { field: "", header: "Acción", width: "20%" },
      { field: "", header: "Acción", width: "20%" },
    ];
  }

  ngOnInit() {
    console.log("cargando insumo");
    this.loadlist();
  }

  loadlist() {
    this.loading = true;
    try {
      this.sectorService.getGrupo().subscribe(
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

    const ref = this.dialogService.open(GrupoTrabajoEditarComponent, {
      data,
      header: "Editar grupo de trabajo",
      width: "60%",
      height: "50%",
    });

    ref.onClose.subscribe((response: any) => {
      if (!!response) {
        this.loadlist();
      }
    });
  }

  nuevo() {
    const data: any = null;

    const ref = this.dialogService.open(GrupoTrabajoEditarComponent, {
      data,
      header: "Crear grupo de trabajo",
      width: "60%",
      height: "50%",
    });

    ref.onClose.subscribe((response: any) => {
      if (!!response) {
        this.loadlist();
      }
    });
  }

  asociarUsuario(elemento) {
    const data: any = elemento;

    const ref = this.dialogService.open(GrupoTrabajoAsociarComponent, {
      data,
      header: "Asociar usuarios",
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
