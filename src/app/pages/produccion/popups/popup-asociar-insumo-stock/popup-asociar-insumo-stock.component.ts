import { Component, OnInit } from "@angular/core";
import { InsumoService } from "../../../../services/insumo.service";
import { ProduccionService } from "../../../../services/produccion.service";
import { AlertServiceService } from "../../../../services/alert-service.service";

import { MessageService } from "primeng-lts/api";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng-lts/dynamicdialog";
import { OverlayPanel } from "primeng-lts/overlaypanel";
import swal from "sweetalert2";
import { Filter } from "../../../../shared/filter";

@Component({
  selector: "app-popup-asociar-insumo-stock",
  templateUrl: "./popup-asociar-insumo-stock.component.html",
  styleUrls: ["./popup-asociar-insumo-stock.component.scss"],
  styles: [
    `
      :host ::ng-deep .p-cell-editing {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
    `,
  ],
})
export class PopupAsociarInsumoStockComponent implements OnInit {
  cols: any[];
  cols_produccion: any[];
  columns: any[];
  elementos: any[];

  selectedElemento: any;
  selecteditems: any;
  loading;
  cantidad: number = 0;
  cantidad_botella: number = 0;
  cantidad_litros: number = 0;
  cantidad_original: number = 0;
  cantidad_salida: number = 0;
  existencia = 0;
  cantidad_ingresada = 0;
  elementosAsociar: any[] = [];
  cantidadProyectada = 0;
  cantidadEstimada = 0;
  cantidadAfectada = 0;
  selectedRow: any;
  acumulado = 0;
  userData: any[];

  clonedElenents: { [s: string]: any } = {};

  constructor(
    private insumoService: InsumoService,
    private produccionService: ProduccionService,
    private alertServiceService: AlertServiceService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private messageService: MessageService,
    private filter: Filter
  ) {
    console.log(this.config.data);

    this.cols = [
      { field: "nombre", header: "Insumo", width: "36%" },
      { field: "descripcion", header: "Descripción", width: "26%" },
      { field: "comprobante", header: "Comprobante", width: "18%" },
      { field: "lote", header: "Lote", width: "18%" },
      { field: "fecha_ingreso", header: "ingresó", width: "18%" },
      { field: "cantidad_existente", header: "Existencia", width: "18%" },
      { field: "cantidad_afectada", header: "Usado", width: "18%" },
    ];

    this.userData = JSON.parse(localStorage.getItem("userData"));
  }

  ngOnInit() {
    this.verDetalle();
  }

  changeValor(event, elem: any) {
    console.log(event.target.value);
    console.log(elem);
    const resultado = this.elementos.findIndex(
      (x) => x["stock_movimiento_id"] === elem.stock_movimiento_id
    );
    this.elementos[resultado]["cantidad_afectada"] = event.target.value;
    console.log(this.elementos[resultado]);

    this.acumulado = 0;

    this.elementos.forEach((element) => {
      this.acumulado =
        Number(this.acumulado) + Number(element.cantidad_afectada);
    });
  }

  accion(event: any, overlaypanel: OverlayPanel, elementos: any) {
    this.selectedRow = elementos;
    this.cantidadEstimada = elementos.cantidad_estimada;
    console.log(this.selectedRow);
    overlaypanel.toggle(event);
  }

  cerrarVentanta() {
    this.cantidad_ingresada = 0;
  }

  agregarValor(event: any, overlaypanel: OverlayPanel) {
    this.selectedRow.cantidad_afectada = this.cantidad_ingresada;
    console.log(this.selectedRow.cantidad_afectada);
    this.cantidad_ingresada = 0;
    this.acumulado = 0;

    this.elementos.forEach((element) => {
      this.acumulado = Number(this.acumulado) + element.cantidad_afectada;
    });

    console.log(event);
    overlaypanel.hide();
  }

  agregar(event: any, overlaypanel: OverlayPanel, elementos: any) {
    this.selectedRow = elementos;
    this.selectedRow.cantidad_afectada = elementos.cantidad_estimada;
  }

  verDetalle() {
    this.loading = true;
    try {
      this.produccionService
        .getStockByArmadoProducto(
          this.config.data.articulo_id,
          this.config.data.insumo_id
        )
        .subscribe(
          (resp) => {
            console.log(resp);
            let i = 0;
            this.elementos = resp;
            console.log(this.elementos);
            resp.forEach((element) => {
              element.cantidad_afectada = 0;
              element.cantidad_proyectada =
                Number(element.cantidad) *
                Number(this.config.data.cantidad_solicitada);
              element.cantidad_estimada =
                Number(element.cantidad) *
                Number(this.config.data.cantidad_producida);

              /*     this.cantidad = this.elementos[i]['cantidad'];
            this.cantidad_botella = Number(this.cantidad_botella)+ Number(this.elementos[i]['cantidad_botella']);
            this.cantidad_litros =  Number(this.cantidad_litros)+ Number(this.elementos[i]['cantidad_litros']);
            this.cantidad_original = this.elementos[i]['cantidad_original'];
            this.cantidad_salida =Number(this.cantidad_salida)+ Number(this.elementos[i]['cantidad_salida']);
            this.existencia = Number(this.existencia)+ Number(this.elementos[i]['existencia']); */
              i++;
            });
            this.loading = false;
          },
          (error) => {
            // error path
            console.log(error);
            this.loading = false;
            this.alertServiceService.throwAlert(
              "error",
              "Error: " + error.status + "  Error al cargar los registros",
              "",
              "500"
            );
          }
        );
    } catch (error) {
      this.loading = false;
      this.alertServiceService.throwAlert(
        "error",
        "Error: " + error.status + "  Error al cargar los registros",
        "",
        "500"
      );
    }
  }

  guardar() {
    swal({
      title: "Confirmar sociar insumos",
      text: "Va a asociar los insumos por un total de " + this.acumulado,
      showCancelButton: true,
      confirmButtonColor: "#42A5F5",
      cancelButtonColor: "#E53935",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, asociar",
    }).then((result) => {
      if (result.value) {
        console.log("guardado");
        console.log(this.elementos);
        this.elementos.forEach((element) => {
          //console.log(element)
          if (Number(element.cantidad_afectada) > 0) {
            element.cantidad_existente =
              Number(element.cantidad) - element.cantidad_afectada;
            element.cantidad_usada = element.cantidad_afectada;
            element.orden_produccion_detalle_id =
              this.config.data.orden_produccion_detalle_id;
            element.cantidadEstimada = this.cantidadEstimada;
            element.usuario_alta_id = this.userData["id"];
            element.deposito_id = 2;
            element.ultimo_deposito_id = 2;
            this.elementosAsociar.push(element);
          }
          console.log(this.elementosAsociar);
        });
        if (this.elementosAsociar.length > 0) {
          this.asociarInsunos();
        } else {
          this.alertServiceService.throwAlert(
            "warning",
            "Debe seleccionar al menos un insumo",
            "Falta cargar insumos",
            "500"
          );
          this.elementosAsociar = [];
        }

        //  this.ref.close(this.elementos);
      }
    });
  }

  asociarInsunos() {
    this.loading = true;
    try {
      this.produccionService
        .setInsumoStockMovimientoProduccion(this.elementosAsociar)
        .subscribe(
          (resp) => {
            console.log(resp);
            this.loading = false;

            this.ref.close(this.elementosAsociar);
            this.elementosAsociar = [];
          },
          (error) => {
            // error path
            console.log(error);
            this.loading = false;
            this.alertServiceService.throwAlert(
              "error",
              "Error: " + error.status + "  Error al cargar los registros",
              "",
              "500"
            );
          }
        );
    } catch (error) {
      this.loading = false;
      this.alertServiceService.throwAlert(
        "error",
        "Error: " + error.status + "  Error al cargar los registros",
        "",
        "500"
      );
      this.elementosAsociar = [];
    }
  }

  onRowEditInit(element: any) {
    console.log(element);
    this.clonedElenents[element.id] = { ...element };
  }

  onRowEditSave(element: any) {
    console.log(element);
    //if (product.price > 0) {
    //    delete this.clonedProducts[product.id];
    //    this.messageService.add({severity:'success', summary: 'Success', detail:'Product is updated'});
    //}
    //else {
    //    this.messageService.add({severity:'error', summary: 'Error', detail:'Invalid Price'});
    //}
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
