import { Component, OnInit } from "@angular/core";
import { InsumoService } from "../../../services/insumo.service";
import { AlertServiceService } from "../../../services/alert-service.service";
import { MessageService } from "primeng-lts/api";
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from "primeng-lts/dynamicdialog";
import { MaquinaEditarComponent } from "./../maquina-editar/maquina-editar.component";
import { ProduccionService } from "./../../../services/produccion.service";

@Component({
  selector: "app-maquina",
  templateUrl: "./maquina.component.html",
  styleUrls: ["./maquina.component.scss"],
})
export class MaquinaComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(
    private produccionService: ProduccionService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.cols = [
      { field: "maquina_nombre", header: "Linea", width: "80%" },
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
      this.produccionService.getMaquinas().subscribe(
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

    const ref = this.dialogService.open(MaquinaEditarComponent, {
      data,
      header: "Editar Linea",
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

    const ref = this.dialogService.open(MaquinaEditarComponent, {
      data,
      header: "Crear Linea",
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
