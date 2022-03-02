import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng-lts/api";
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from "primeng-lts/dynamicdialog";
import { ProduccionService } from "./../../../../services/produccion.service";
import { AlertServiceService } from "./../../../../services/alert-service.service";
import { calendarioIdioma } from "./../../../../config/config";
import { PopUpOrdenProduccionDetalleEditarComponent } from "./../pop-up-orden-produccion-detalle-editar/pop-up-orden-produccion-detalle-editar.component";
import { OrdenProduccionDetalle } from "./../../../../models/orden-produccion-detalle.model";
import { OrdenProduccion } from "./../../../../models/orden-produccion.model";
import { formatDate } from "@angular/common";
import { OverlayPanel } from "primeng-lts/overlaypanel";
import { Filter } from "../../../../shared/filter";

@Component({
  selector: "app-pop-orden-produccion-editar",
  templateUrl: "./pop-orden-produccion-editar.component.html",
  styleUrls: ["./pop-orden-produccion-editar.component.scss"],
  providers: [DialogService],
})
export class PopOrdenProduccionEditarComponent implements OnInit {
  editar;
  fecha_creacion: Date;
  _fecha_creacion: string;
  _fecha_produccion: string;
  fecha_produccion: Date;
  fecha_desde: Date;
  fecha_hasta: Date;
  _fecha_desde: string;
  _fecha_hasta: string;
  descripcion: string;
  obesrvacion: string;
  hora: Date;
  cantidad_solicitada: number;
  cantidad_usada: number;
  cantidad_existente: number;
  fecha: Date;
  es: any;
  cols: any[];
  columns: any[];
  elementos: any[] = [];
  ordenProduccion: OrdenProduccion = null;
  selecteditems: any;
  loading;
  userData: any;
  estado: any[] = [];
  selectedEstado: string = "ACTIVO";
  selectedEstadoRenglon: string = "ACTIVO";
  selectedRow: any = null;
  position: string;
  _estado: any[] = [];
  _nombre: any[] = [];
  _descripcion: any[] = [];

  // tslint:disable-next-line: max-line-length
  constructor(
    private alertServiceService: AlertServiceService,
    private produccionService: ProduccionService,
    public dialogService: DialogService,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private filter: Filter
  ) {
    this.cols = [
      { field: "fecha_produccion", header: "Generado", width: "15%" },
      { field: "nombre", header: "Producto", width: "25%" },
      { field: "descripcion", header: "Descripción", width: "30%" },
      { field: "pallet_pack", header: "Pack", width: "8%" },
      { field: "pallet_pisos", header: "Pisos", width: "8%" },
      { field: "unidad_hora", header: "U/h", width: "8%" },
      { field: "unidades", header: "Unidades", width: "10%" },
      { field: "cantidad_solicitada", header: "A producir", width: "12%" },
      { field: "cantidad_usada", header: "Producido", width: "12%" },
      { field: "cantidad_existente", header: "Restante", width: "12%" },
      { field: "estado", header: "Estado", width: "15%" },
      { field: "", header: "", width: "6%" },
    ];

    this.estado = [
      { name: "ACTIVO", value: "ACTIVO" },
      { name: "PAUSADO", value: "PAUSADO" },
      { name: "FINALIZADO", value: "FINALIZADO" },
      { name: "CANCELADO", value: "CANCELADO" },
    ];
  }

  ngOnInit() {
    this.es = calendarioIdioma;
    this.fecha_creacion = new Date();
    this.fecha_desde = new Date();
    this.fecha_hasta = new Date();
    this.fecha = new Date();
    this.es = calendarioIdioma;

    console.log(this.config.data);
    if (this.config.data) {
      this.editar = true;
      this.obesrvacion = this.config.data.observacion;
      this.descripcion = this.config.data.descripcion;
      this.fecha_creacion = new Date(this.config.data.fecha_creacion);
      this.fecha_desde = new Date(this.config.data.fecha_desde);
      this.fecha_hasta = new Date(this.config.data.fecha_hasta);
      console.log(this.config.data.estado);
      this.selectedEstado = this.config.data.estado;
      this.loadlist(this.config.data.id);
    }

    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData);
  }

  editarProduccion(event: any, overlaypanel: OverlayPanel, elem: any) {
    this.selectedRow = elem;
    // this._fecha_produccion = formatDate(new Date(elem.fecha_produccion), 'yyyy-MM-dd', 'en');
    console.log(new Date(elem.fecha_produccion));
    this.fecha_produccion = new Date(elem.fecha_produccion);
    this.cantidad_solicitada = elem.cantidad_solicitada;
    this.cantidad_usada = elem.cantidad_usada;
    this.cantidad_existente = elem.cantidad_existente;
    this.hora = elem.hora;

    console.log(elem.cantidad_solicitada);
    console.log(this.selectedRow);
    //this.fecha_produccion = this.selectedRow['fecha_produccion'];
    this.position = "top";
    //this.displayEstado = true;
    overlaypanel.toggle(event);
  }

  actualizarFecha(event) {
    console.log(event);
    this.fecha_creacion = event;
    console.log(new Date(this.fecha_creacion));
  }

  onChangeEstado(e) {
    console.log(e.target.value);
  }

  onChangeEstadoRenglon(e) {
    console.log(e.target.value);
    console.log(e.target);
    this.cambiarEstadoRenglon();
  }

  onChangeHoraRenglon(e) {
    console.log(e.target.value);
    console.log(e.target);
    this.cambiarEstadoRenglon();
  }

  loadlist(produccion: any) {
    console.log(produccion);
    this.loading = true;
    try {
      this.produccionService
        .produccionDetalleByProduccionId(produccion)
        .subscribe(
          (resp) => {
            if (resp[0]) {
              this.elementos = resp;
              this.realizarFiltroBusqueda(resp);
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

  buscarArticulo() {
    const data: any = null;

    const ref = this.dialogService.open(
      PopUpOrdenProduccionDetalleEditarComponent,
      {
        data,
        header: "Asociar articulo",
        width: "98%",
        height: "90%",
      }
    );

    // tslint:disable-next-line: no-shadowed-variable
    ref.onClose.subscribe((PopUpOrdenProduccionDetalleEditarComponent: any) => {
      if (PopUpOrdenProduccionDetalleEditarComponent) {
        console.log(PopUpOrdenProduccionDetalleEditarComponent);
        this.elementos.push(PopUpOrdenProduccionDetalleEditarComponent);
      }
    });
  }

  detalle(element: any) {
    console.log(element);
  }

  nuevo() {
    this._fecha_creacion = formatDate(
      new Date(this.fecha_creacion),
      "yyyy-MM-dd",
      "en"
    );
    this._fecha_desde = formatDate(
      new Date(this.fecha_desde),
      "yyyy-MM-dd",
      "en"
    );
    this._fecha_hasta = formatDate(
      new Date(this.fecha_hasta),
      "yyyy-MM-dd",
      "en"
    );
    if (this.elementos.length > 0) {
      if (this.obesrvacion !== "" && this.descripcion !== "") {
        // tslint:disable-next-line: max-line-length
        this.ordenProduccion = new OrdenProduccion(
          "0",
          this._fecha_creacion,
          this.userData["id"],
          this.descripcion,
          this.obesrvacion,
          this.elementos,
          this._fecha_desde,
          this._fecha_hasta
        );
        console.log(this.ordenProduccion);
        this.guardar(this.ordenProduccion);
      } else {
        this.alertServiceService.throwAlert(
          "warning",
          "El campo descripción  y observación debe estar completo",
          "",
          "500"
        );
      }
    } else {
      this.alertServiceService.throwAlert(
        "warning",
        "La producción debe tener al menos un producto",
        "",
        "500"
      );
    }
  }

  removerProduccion(_elemento: any) {
    console.log(_elemento);
    let index = 0;
    if (_elemento.orden_produccion_detalle_id === 0) {
      index = this.elementos.findIndex(
        (x) => x.articulo_id === _elemento.articulo_id
      );
    } else {
      index = this.elementos.findIndex(
        (x) =>
          x.orden_produccion_detalle_id ===
          _elemento.orden_produccion_detalle_id
      );
    }

    console.log(index);
    this.elementos.splice(index, 1);
  }

  guardar(ordenProduccion: OrdenProduccion) {
    try {
      this.produccionService
        .setProduccionOrdenProduccion(ordenProduccion)
        .subscribe(
          (resp) => {
            if (resp) {
              this.elementos = resp;
              console.log(this.elementos);
              this.alertServiceService.throwAlert(
                "success",
                "Orden de producción creada con el número: " + resp,
                "",
                "200"
              );
              this.ref.close();
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

  cambiarEstado() {
    try {
      let produccion = this.config.data;
      produccion.estado = this.selectedEstado;
      this.produccionService
        .updProduccionEstado(produccion, produccion.id)
        .subscribe(
          (resp) => {
            if (resp) {
              this.elementos = resp;
              console.log(this.elementos);
              this.realizarFiltroBusqueda(resp);
              this.alertServiceService.throwAlert(
                "success",
                "Estado de orden de producción modificado a  " +
                  produccion.estado,
                "",
                "200"
              );
              this.ref.close();
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

  cambiarEstadoRenglon() {
    try {
      this._fecha_produccion = formatDate(
        new Date(this.fecha_produccion),
        "yyyy-MM-dd",
        "en"
      );
      this.selectedRow.fecha_produccion = this._fecha_produccion;
      this.selectedRow.estado = this.selectedEstadoRenglon;
      this.selectedRow.cantidad_solicitada = this.cantidad_solicitada;
      this.selectedRow.cantidad_existente = this.cantidad_existente;
      this.selectedRow.cantidad_usada = this.cantidad_usada;
      this.selectedRow.hora = this.hora;
      console.log(this.selectedRow);
      this.produccionService
        .updProduccionDetalleEstado(
          this.selectedRow,
          this.selectedRow.orden_produccion_detalle_id
        )
        .subscribe(
          (resp) => {
            this.loadlist(this.config.data.id);
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

  colorRow(estado: string) {
    if (estado === "ACTIVO") {
      return { "es-activo": "null" };
    }
    if (estado === "PAUSADO") {
      return { "es-pausado": "null" };
    }
    if (estado === "CANCELADO") {
      return { "es-cancelado": "null" };
    }
    if (estado === "FINALIZADO") {
      return { "es-finalizado": "null" };
    }
  }

  realizarFiltroBusqueda(resp: any[]) {
    // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
    this._estado = [];
    this._nombre = [];
    this._descripcion = [];

    resp.forEach((element) => {
      this._estado.push(element.estado);
      this._nombre.push(element.nombre);
      this._descripcion.push(element.descripcion);
    });

    // ELIMINO DUPLICADOS
    this._estado = this.filter.filterArray(this._estado);
    this._nombre = this.filter.filterArray(this._nombre);
    this._descripcion = this.filter.filterArray(this._descripcion);
  }
}
