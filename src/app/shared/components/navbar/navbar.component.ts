import { AuthenticationService } from "./../../../services/authentication.service";
import { Component, OnInit } from "@angular/core";
import { MenuItem, MessageService } from "primeng-lts/api";
import { OverlayPanel } from "primeng-lts/overlaypanel";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { User } from "./../../../models/user.model";
import { UserService } from "./../../../services/user.service";
import swal from "sweetalert2";

import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from "primeng-lts/dynamicdialog";
import { DatePipe } from "@angular/common";
import { AlertServiceService } from "./../../../services/alert-service.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  providers: [MessageService, DialogService, DatePipe],
})
export class NavbarComponent implements OnInit {
  user: User;
  general: MenuItem[];
  mantenimiento = true;
  gestion_auditoria = true;
  administacion_auditoria = true;
  gestion_produccion = true;
  administracion_produccion = true;
  gestion_stock = true;
  administracion_stock = true;
  gerencia = true;
  movil_calidad = true;
  movil_insumo = true;

  public username: string;
  public puesto: string;
  public name: string;
  public email: string;
  elemento: User = null;

  returnUrl: string;
  error = "";
  notificaciones = 0;
  chats;
  currentUser = null;
  items: MenuItem[];
  constructor(
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private miServico: UserService
  ) {
    this.setMenuElements();
  }
  navbarOpen = false;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  ngOnInit() {}

  private setMenuElements(): void {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    console.log(this.currentUser);
    if (this.currentUser) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      console.log(userData);
      console.log("usuario logueado");
      this.username = userData.username;
      this.name = userData.name;
      this.email = userData.email;
      console.log(userData.access_list);
      this.asignarModulos(userData.access_list);
    } else {
      this.router.navigate(["/login"]);
    }
  }

  asignarModulos(modulos: any) {
    modulos.forEach((element) => {
      // console.log(element['modulo_nombre']);
      if (element.modulo_nombre === "mantenimiento") {
        this.mantenimiento = false;
      }
      if (element.modulo_nombre === "gestion_auditoria") {
        this.gestion_auditoria = false;
      }
      if (element.modulo_nombre === "administacion_auditoria") {
        this.administacion_auditoria = false;
        console.log(element.modulo_nombre);
      }
      if (element.modulo_nombre === "gestion_produccion") {
        this.gestion_produccion = false;
      }
      if (element.modulo_nombre === "administracion_produccion") {
        this.administracion_produccion = false;
      }
      if (element.modulo_nombre === "gestion_stock") {
        this.gestion_stock = false;
      }
      if (element.modulo_nombre === "administracion_stock") {
        this.administracion_stock = false;
      }
      if (element.modulo_nombre === "gerencia") {
        this.gerencia = false;
      }

      if (element.modulo_nombre === "movil_calidad") {
        this.movil_calidad = false;
      }

      if (element.modulo_nombre === "movil_insumo") {
        this.movil_insumo = false;
      }
    });
    this.buildMenuItems();
    /** DESPUES DE ASIGNAR MODULOS VERIFICO LAS NOTIFICACIONES */
  }

  private buildMenuItems(): void {
    this.general = [
      {
        label: "Producción",
        icon: "fas fa-people-carry",
        visible: !this.administracion_produccion,
        items: [
          {
            label: "Stock de insumos",
            visible: !this.administracion_produccion,
            items: [
              {
                label: "Ingresar insumos",
                visible: !this.gestion_produccion,
                routerLink: "/insumo/stock/ingreso",
              },
              {
                label: "Stock de insumos",
                visible: !this.administracion_produccion,
                routerLink: "/insumo/stock",
              },
              {
                label: "Indicadores de stock insumos",
                visible: !this.administracion_produccion,
                routerLink: "/insumo/indicadores",
              },
            ],
          },
          {
            label: "Planificación de producción",
            visible: !this.gestion_produccion,
            items: [
              {
                label: "Orden de producción",
                visible: !this.gestion_produccion,
                routerLink: "orden/produccion",
              },
              {
                label: "Detalle de ordenes de producción",
                routerLink: "/produccion/ingreso",
              },
              {
                label: "Producciones activas",
                routerLink: "/produccion/proceso",
              },
            ],
          },
          {
            label: "Gestión de producción",
            visible: !this.gestion_produccion,
            items: [
              { label: "Cargar producción", routerLink: "produccion/ingreso" },
              {
                label: "Asociar insumos a producción",
                routerLink: "produccion/asociar/insumo",
              },
              {
                label: "Movimientos de producción",
                routerLink: "produccion/movimientos",
              },
              {
                label: "Movimientos de insumos",
                routerLink: "insumo/movimientos",
              },
            ],
          },
        ],
      },
      {
        label: "Gerencia",
        icon: "fas fa-chart-pie",
        visible: !this.gerencia,
        items: [
          { label: "Producción", routerLink: "orden/produccion" },
          {
            label: "Procesos de producción",
            routerLink: "/produccion/proceso",
          },
          { label: "Control de calidad", routerLink: "control/calidad" },
          {
            label: "Controles de realizados",
            routerLink: "/control/calidad/produccion",
          },
          { label: "Insumos", routerLink: "gerencia/insumo" },
        ],
      },

      {
        label: "Auditoria",
        icon: "fas fa-vial",
        visible: !this.gestion_auditoria,
        items: [
          {
            label: "Control de producción",
            routerLink: "/control/calidad/produccion",
          },
          {
            label: "Indicadores",
            items: [
              {
                label: "Controles realizados",
                visible: !this.gestion_auditoria,
                routerLink: "/control/calidad",
              },
              {
                label: "Lineas de producción",
                visible: !this.gestion_auditoria,
                routerLink: "/control/linea",
              },
            ],
          },
        ],
      },
      // BLOQUEADO HASTA QUE SE DEFINA  SU USO
      /*    {
        label: "Realizar control",
        icon: " fas fa-mobile-alt",
        visible: !this.movil_calidad,
        routerLink: "/movil/control/calidad",
      }, */
      {
        label: "Insumos",
        icon: "fas fa-business-time",
        visible: !this.movil_insumo,
        routerLink: "/movil/insumo/stock/ingreso",
      },

      {
        label: "Ventas",
        icon: "fas fa-archive",
        visible: !this.administracion_produccion,
        items: [
          { label: "Orden de pedido", routerLink: "/ventas/orden/pedido" },
          { label: "Stock en depósito", routerLink: "/ventas/stock" },
          {
            label: "Estadistica",
            items: [
              {
                label: "Producccion",
                visible: !this.administracion_produccion,
                routerLink: "/ventas/estadistica/produccion",
              },
              {
                label: "Stock",
                visible: !this.administracion_produccion,
                routerLink: "/ventas/estadistica/stock",
              },
            ],
          },
        ],
      },

      {
        label: "Mantenimiento",
        icon: "fas fa-cogs",
        items: [
          {
            label: "Parametros",
            visible: !this.administracion_produccion,
            items: [
              { label: "Producto", routerLink: "mantenimiento/articulo" },
              { label: "Insumo", routerLink: "mantenimiento/insumo" },
              {
                label: "Armado de producto",
                routerLink: "mantenimiento/articulo/confeccion",
              },
              { label: "Unidad", routerLink: "mantenimiento/unidad" },
              {
                label: "Grupo de insumos",
                routerLink: "mantenimiento/grupo/analisis",
              },
              { label: "Grupos", routerLink: "mantenimiento/grupo" },
              {
                label: "Lineas de producción",
                routerLink: "mantenimiento/lineas/produccion",
              },
              { label: "Depósito", routerLink: "mantenimiento/deposito" },
            ],
          },
          {
            label: "Calidad",

            items: [
              {
                label: "Encabezado",
                routerLink: "mantenimiento/calidad/encabezado",
              },
              {
                label: "Parametros",
                routerLink: "mantenimiento/calidad/parametro",
              },
              {
                label: "Confección de planilla",
                routerLink: "mantenimiento/calidad/encabezado/parametro",
              },
            ],
          },
          {
            label: "Usuario",
            visible: !this.mantenimiento,
            routerLink: "usuario",
          },
          {
            label: "Notificaciones",
            routerLink: "mantenimiento/notificaciones/personal",
          },
        ],
      },
    ];
  }

  accion(evt: any, overlaypanel: OverlayPanel) {
    console.log(evt);
    overlaypanel.toggle(evt);
  }

  cerrarSesion() {
    swal({
      title: "Cerrando sesión",
      text: "¿Desea finalizar la sesión actual?",
      showCancelButton: true,
      confirmButtonColor: "#E53935",
      cancelButtonColor: "#42A5F5",
      cancelButtonText: "Permanecer",
      confirmButtonText: "Cerrar sesión",
      imageUrl: "https://img.icons8.com/clouds/100/000000/imac-exit.png",
      imageHeight: 128,
      imageWidth: 128,
    }).then((result) => {
      if (result.value) {
        console.log("sesion terminada");
        this.authenticationService.logout();

        this.gestion_auditoria = true;
        this.administacion_auditoria = true;
        this.gestion_produccion = true;
        this.administracion_produccion = true;
        this.gestion_stock = true;
        this.administracion_stock = true;
        this.gerencia = true;
        this.movil_calidad = true;
        this.movil_insumo = true;

        this.user = null;
        this.elemento = null;
        localStorage.removeItem("userData");
        window.location.reload();
      }
    });
  }

  ver() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    console.log(currentUser.access_token);
  }
}
