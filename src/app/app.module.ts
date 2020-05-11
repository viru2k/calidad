import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData, LocationStrategy, HashLocationStrategy, CurrencyPipe, DecimalPipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule  } from '@angular/common/http';

/* -------------------------------------------------------------------------- */
/*                                  SERVICIOS                                 */
/* -------------------------------------------------------------------------- */

import { ExcelService } from './services/excel.service';
import { PushNotificationService } from './services/push-notification.service';

/* -------------------------------------------------------------------------- */
/*                             PRIME NG LIBRERIAS                             */
/* -------------------------------------------------------------------------- */

import {OrderListModule} from 'primeng/orderlist';
import {CheckboxModule} from 'primeng/checkbox';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {DialogModule} from 'primeng/dialog';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CalendarModule} from 'primeng/calendar';
import {InputMaskModule} from 'primeng/inputmask';
import {MenubarModule} from 'primeng/menubar';
import {MenuModule} from 'primeng/menu';
import {SpinnerModule} from 'primeng/spinner';
import {ToastModule} from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import {ListboxModule} from 'primeng/listbox';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {MenuItem, MessageService, DialogService, SelectItem} from 'primeng/api';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {PanelModule} from 'primeng/panel';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {InputSwitchModule} from 'primeng/inputswitch';
import {ToggleButtonModule} from 'primeng/togglebutton';





/* -------------------------------------------------------------------------- */
/*                            LIBRERIAS DE TERCEROS                           */
/* -------------------------------------------------------------------------- */

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { AutofocusModule } from 'angular-autofocus-fix';
import localeEsAR from '@angular/common/locales/es-AR';
import { PivotViewModule } from '@syncfusion/ej2-angular-pivotview';

/* -------------------------------------------------------------------------- */
/*                                 COMPONENTES                                */
/* -------------------------------------------------------------------------- */

import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { EmptyComponent } from './pages/info/empty/empty.component';
import { NotFoundComponent } from './pages/info/not-found/not-found.component';
import { DateFormatPipe } from './shared/pipes/date-format.pipe';

/* -------------------------------------------------------------------------- */
/*                                 DIRECTIVAS                                 */
/* -------------------------------------------------------------------------- */



import { NgxPopper } from 'angular-popper';
import { ProduccionindicadoresComponent } from './pages/produccion/produccionindicadores/produccionindicadores.component';
import { CalidadindicadoresComponent } from './pages/calidad/calidadindicadores/calidadindicadores.component';
import { ArticuloComponent } from './pages/mantenimiento/articulo/articulo.component';
import { ArticuloEditarComponent } from './pages/mantenimiento/articulo-editar/articulo-editar.component';
import { ArticuloConfeccionEditarComponent } from './pages/mantenimiento/articulo-confeccion-editar/articulo-confeccion-editar.component';
import { ArticuloConfeccionComponent } from './pages/mantenimiento/articulo-confeccion/articulo-confeccion.component';
import { InsumoComponent } from './pages/mantenimiento/insumo/insumo.component';
import { InsumoEditarComponent } from './pages/mantenimiento/insumo-editar/insumo-editar.component';
import { UsuarioComponent } from './pages/mantenimiento/usuario/usuario.component';
import { UsuarioEditarComponent } from './pages/mantenimiento/usuario-editar/usuario-editar.component';
import { UnidadComponent } from './pages/mantenimiento/unidad/unidad.component';
import { UnidadEditarComponent } from './pages/mantenimiento/unidad-editar/unidad-editar.component';
import { CalidadControlComponent } from './pages/mantenimiento/calidad/calidad-control/calidad-control.component';
// tslint:disable-next-line: max-line-length
import { CalidadControlEditarComponent } from './pages/mantenimiento/calidad/calidad-control/calidad-control-editar/calidad-control-editar.component';
import { CalidadDatoRelevadoComponent } from './pages/mantenimiento/calidad/calidad-dato-relevado/calidad-dato-relevado.component';
// tslint:disable-next-line: max-line-length
import { CalidadDatoRelevadoEditarComponent } from './pages/mantenimiento/calidad/calidad-dato-relevado/calidad-dato-relevado-editar/calidad-dato-relevado-editar.component';
import { CalidadTipoControlComponent } from './pages/mantenimiento/calidad/calidad-tipo-control/calidad-tipo-control.component';
// tslint:disable-next-line: max-line-length
import { CalidadTipoControlEditarComponent } from './pages/mantenimiento/calidad/calidad-tipo-control/calidad-tipo-control-editar/calidad-tipo-control-editar.component';
import { CustomPreloaderComponent } from './shared/components/custom-preloader/custom-preloader.component';
import { PopupArticuloConsultaComponent } from './shared/components/popups/popup-articulo-consulta/popup-articulo-consulta.component';
import { PopupInsumoConsultaComponent } from './shared/components/popups/popup-insumo-consulta/popup-insumo-consulta.component';
// tslint:disable-next-line: max-line-length
import { PopupArticuloDistribucionConsultaComponent } from './shared/components/popups/popup-articulo-distribucion-consulta/popup-articulo-distribucion-consulta.component';
import { PopupUsuarioComponent } from './shared/components/popups/popup-usuario/popup-usuario.component';
import { OrdenPedidoComponent } from './pages/produccion/orden-pedido/orden-pedido.component';
import { OrdenPedidoIngresoComponent } from './pages/produccion/orden-pedido-ingreso/orden-pedido-ingreso.component';
import { MovimientoProduccionComponent } from './pages/produccion/movimiento-produccion/movimiento-produccion.component';
import { MovimientoInsumoComponent } from './pages/produccion/movimiento-insumo/movimiento-insumo.component';
import { IngresoProduccionComponent } from './pages/produccion/ingreso-produccion/ingreso-produccion.component';
import { AsociarProduccionComponent } from './pages/produccion/popups/popup/asociar-produccion/asociar-produccion.component';
// tslint:disable-next-line: max-line-length
import { AsociarProduccionDetalleComponent } from './pages/produccion/popups/popup/asociar-produccion-detalle/asociar-produccion-detalle.component';
import { AsociarInsumoDetalleComponent } from './pages/produccion/popups/popup/asociar-insumo-detalle/asociar-insumo-detalle.component';
import { AsociarInsumoComponent } from './pages/produccion/popups/popup/asociar-insumo/asociar-insumo.component';
import { AsociarInsumoAltaComponent } from './pages/produccion/asociar-insumo/asociar-insumo-alta/asociar-insumo-alta.component';
import { PopupCalculdorPalletsComponent } from './shared/components/popups/popup-calculdor-pallets/popup-calculdor-pallets.component';
// tslint:disable-next-line: max-line-length
import { PopupOrdenPedidoDetalleComponent } from './pages/produccion/orden-pedido/popup-orden-pedido-detalle/popup-orden-pedido-detalle.component';
import { ParametrosComponent } from './pages/mantenimiento/produccion/parametros/parametros.component';
import { OrdenProduccionComponent } from './pages/produccion/orden-produccion/orden-produccion.component';
import { ProduccionProcesoComponent } from './pages/produccion/produccion-proceso/produccion-proceso.component';
// tslint:disable-next-line: max-line-length
import { PopupArticuloConfeccionInsumoComponent } from './pages/mantenimiento/articulo-confeccion/popup-articulo-confeccion-insumo/popup-articulo-confeccion-insumo.component';
// tslint:disable-next-line: max-line-length
import { PopupInsumoAsociarArticuloComponent } from './pages/mantenimiento/articulo-confeccion/popup-articulo-confeccion-insumo/popup-insumo-asociar-articulo/popup-insumo-asociar-articulo.component';
// tslint:disable-next-line: max-line-length
import { PopOrdenProduccionEditarComponent } from './pages/produccion/orden-produccion/pop-orden-produccion-editar/pop-orden-produccion-editar.component';
// tslint:disable-next-line: max-line-length
import { PopUpOrdenProduccionDetalleEditarComponent } from './pages/produccion/orden-produccion/pop-up-orden-produccion-detalle-editar/pop-up-orden-produccion-detalle-editar.component';
import { PopupOrdenProduccionDetalleConsultaComponent } from './pages/produccion/ingreso-produccion/popup-orden-produccion-detalle-consulta/popup-orden-produccion-detalle-consulta.component';
import { PopupAsociarProduccionComponent } from './pages/produccion/ingreso-produccion/popup-orden-produccion-detalle-consulta/popup-asociar-produccion/popup-asociar-produccion.component';
import { PopupAsociarProduccionDetalleComponent } from './pages/produccion/ingreso-produccion/popup-orden-produccion-detalle-consulta/popup-asociar-produccion-detalle/popup-asociar-produccion-detalle.component';
import { GrupoTrabajoComponent } from './pages/mantenimiento/grupo-trabajo/grupo-trabajo.component';
import { GrupoTrabajoEditarComponent } from './pages/mantenimiento/grupo-trabajo-editar/grupo-trabajo-editar.component';
import { GrupoTrabajoAsociarComponent } from './pages/mantenimiento/grupo-trabajo-asociar/grupo-trabajo-asociar.component';
import { GrupoTrabajoAsociarEditarComponent } from './pages/mantenimiento/grupo-trabajo-asociar-editar/grupo-trabajo-asociar-editar.component';
import { UsuarioModuloComponent } from './pages/mantenimiento/usuario-editar/usuario-modulo/usuario-modulo.component';
import { MaquinaComponent } from './pages/mantenimiento/maquina/maquina.component';
import { MaquinaEditarComponent } from './pages/mantenimiento/maquina-editar/maquina-editar.component';

registerLocaleData(localeEsAR, 'es-Ar');

@NgModule({
  declarations: [
    AppComponent,
    DateFormatPipe,
    NavbarComponent,
    EmptyComponent,
    NotFoundComponent,
    ProduccionindicadoresComponent,
    CalidadindicadoresComponent,
    ArticuloComponent,
    ArticuloEditarComponent,
    ArticuloConfeccionEditarComponent,
    ArticuloConfeccionComponent,
    InsumoComponent,
    InsumoEditarComponent,
    UsuarioComponent,
    UsuarioEditarComponent,
    UnidadComponent,
    UnidadEditarComponent,
    CalidadControlComponent,
    CalidadControlEditarComponent,
    CalidadDatoRelevadoComponent,
    CalidadDatoRelevadoEditarComponent,
    CalidadTipoControlComponent,
    CalidadTipoControlEditarComponent,
    CustomPreloaderComponent,
    PopupArticuloConsultaComponent,
    PopupInsumoConsultaComponent,
    PopupArticuloDistribucionConsultaComponent,
    PopupUsuarioComponent,
    OrdenPedidoComponent,
    OrdenPedidoIngresoComponent,
    MovimientoProduccionComponent,
    MovimientoInsumoComponent,
    IngresoProduccionComponent,
    AsociarProduccionComponent,
    AsociarProduccionDetalleComponent,
    AsociarInsumoDetalleComponent,
    AsociarInsumoComponent,
    AsociarInsumoAltaComponent,
    PopupCalculdorPalletsComponent,
    PopupOrdenPedidoDetalleComponent,
    ParametrosComponent,
    OrdenProduccionComponent,
    ProduccionProcesoComponent,
    PopupArticuloConfeccionInsumoComponent,
    PopupInsumoAsociarArticuloComponent,
    PopOrdenProduccionEditarComponent,
    PopUpOrdenProduccionDetalleEditarComponent,
    PopupOrdenProduccionDetalleConsultaComponent,
    PopupAsociarProduccionComponent,
    PopupAsociarProduccionDetalleComponent,
    GrupoTrabajoComponent,
    GrupoTrabajoEditarComponent,
    GrupoTrabajoAsociarComponent,
    GrupoTrabajoAsociarEditarComponent,
    UsuarioModuloComponent,
    MaquinaComponent,
    MaquinaEditarComponent
  ],
  imports: [


    BrowserModule,
    FormsModule,
    MultiSelectModule,
    ReactiveFormsModule,
    HttpClientModule ,
    BrowserAnimationsModule,
    TableModule,
    DropdownModule,
    DialogModule,
    RadioButtonModule,
    CalendarModule,
    InputMaskModule,
    MenubarModule,
    MenuModule,
    CheckboxModule,
    SpinnerModule,
    ToastModule,
    ListboxModule,
    OverlayPanelModule,
    DynamicDialogModule,
    OrderListModule,
    InputTextareaModule,
    ScrollPanelModule,
    ProgressSpinnerModule,
    InputSwitchModule,
    PanelModule,
    ToggleButtonModule,
    AutoCompleteModule,
    PivotViewModule ,
    SweetAlert2Module.forRoot(),
    AutofocusModule,
    NgxPopper,
    AppRoutingModule

  ],
  entryComponents: [ArticuloEditarComponent,
     ArticuloConfeccionEditarComponent,
     CalidadTipoControlEditarComponent,
     InsumoEditarComponent,
     UsuarioEditarComponent,
     UnidadEditarComponent,

/* -------------------------------------------------------------------------- */
/*                        ASOCIAR PRODUCCION Y INSUMOS                        */
/* -------------------------------------------------------------------------- */

     AsociarProduccionComponent,
     AsociarProduccionDetalleComponent,
     AsociarInsumoDetalleComponent,
     AsociarInsumoComponent,
     AsociarInsumoAltaComponent,
     PopupOrdenPedidoDetalleComponent,
     PopupArticuloConfeccionInsumoComponent,
     PopupInsumoAsociarArticuloComponent,
     PopOrdenProduccionEditarComponent,
     PopUpOrdenProduccionDetalleEditarComponent,
     PopupOrdenProduccionDetalleConsultaComponent,
     PopupAsociarProduccionComponent,
     PopupAsociarProduccionDetalleComponent,
     MaquinaEditarComponent,

/* -------------------------------------------------------------------------- */
/*                             POPUPS COMPARTIDOS                             */
/* -------------------------------------------------------------------------- */
    PopupArticuloConsultaComponent,
    PopupInsumoConsultaComponent,
    PopupArticuloDistribucionConsultaComponent,
    PopupUsuarioComponent,
    PopupCalculdorPalletsComponent,
    GrupoTrabajoEditarComponent,
    GrupoTrabajoAsociarComponent
    ],
  providers: [CurrencyPipe, DecimalPipe,
    PushNotificationService, ExcelService, { provide: LOCALE_ID, useValue: 'es-Ar' },
 {
  provide: HTTP_INTERCEPTORS,
  useFactory: function(injector: Injector) {
      return new JwtInterceptor(injector);
  },
  multi: true,
  deps: [Injector]
},
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }

