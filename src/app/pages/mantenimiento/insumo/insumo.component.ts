import { Component, OnInit } from "@angular/core";
import { InsumoService } from "../../../services/insumo.service";
import { AlertServiceService } from "../../../services/alert-service.service";
import { MessageService, DialogService } from "primeng/api";
import { InsumoEditarComponent } from "./../insumo-editar/insumo-editar.component";
import { createHash } from "crypto";
import { Filter } from "../../../shared/filter";

@Component({
  selector: "app-insumo",
  templateUrl: "./insumo.component.html",
  styleUrls: ["./insumo.component.scss"],
  providers: [MessageService, DialogService],
})
export class InsumoComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(
    private insumoService: InsumoService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private filter: Filter
  ) {
    this.cols = [
      { field: "nombre", header: "Insumo", width: "25%" },
      { field: "descripcion", header: "Descripción", width: "30%" },
      { field: "unidad_descripcion", header: "Unidad", width: "15%" },
      { field: "grupo_nombre", header: "Grupo", width: "15%" },
      { field: "cantidad_unitaria", header: "C. unitaria", width: "15%" },
      { field: "cantidad_empaque", header: "C. Empaque", width: "15%" },
      { field: "precio_unitario", header: "$ Unitario", width: "15%" },
      { field: "precio_empaque", header: "$ Empaque", width: "15%" },
      { field: "stock_minimo", header: "Stock Min", width: "15%" },
      { field: "stock_promedio", header: "Stock Med", width: "15%" },
      { field: "stock_maximo", header: "Stock Max", width: "15%" },
      { field: "", header: "", width: "10%" },
    ];
  }

  ngOnInit() {
    console.log("cargando insumo");
    this.loadlist();
  }

  loadlist() {
    this.loading = true;
    try {
      this.insumoService.getInsumo().subscribe(
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
    let data: any;
    data = elemento;
    const ref = this.dialogService.open(InsumoEditarComponent, {
      data,
      header: "Editar insumo",
      width: "98%",
      height: "90%",
    });

    ref.onClose.subscribe((response: any) => {
      if (!!response) {
        this.loadlist();
      }
    });
  }

  nuevo() {
    const data: any = null;
    const ref = this.dialogService.open(InsumoEditarComponent, {
      data,
      header: "Editar insumo",
      width: "98%",
      height: "90%",
    });

    ref.onClose.subscribe((response: any) => {
      if (!!response) {
        this.loadlist();
      }
    });
  }

  setColorColumn(color: string) {
    //  console.log('color: ' + color + '!important;');
    //return {color: #CCCA3F!important; : 'null' };
    document.documentElement.style.setProperty("--custom-primary-color", color);
    // return document.documentElement.style.setProperty('--custom-grid-color', color);
    return { "change-grid-color": "null" };

    //  color: #9E9E9E!important;

    // return  'color: ' + color + '!important;';
  }

  parseTrueHexa(str) {
    return str.match(/^ *[a-f0-9]+ *$/i) ? parseInt(str, 16) : NaN;
  }

  _nombre: any[] = [];
  realizarFiltroBusqueda(resp: any[]) {
    // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
    this._nombre = [];
    resp.forEach((element) => {
      this._nombre.push(element.nombre);
    });
    // ELIMINO DUPLICADOS
    this._nombre = this.filter.filterArray(this._nombre);
  }
}
