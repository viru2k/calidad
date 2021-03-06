import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
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
import {CardModule} from 'primeng/card';
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
import {KeyFilterModule} from 'primeng/keyfilter';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {PanelModule} from 'primeng/panel';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {InputSwitchModule} from 'primeng/inputswitch';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {StepsModule} from 'primeng/steps';
import {ColorPickerModule} from 'primeng/colorpicker';
import {SelectButtonModule} from 'primeng/selectbutton';
import {DataViewModule} from 'primeng/dataview';
import {RatingModule} from 'primeng/rating';
import {ChartModule} from 'primeng/chart';



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
registerLocaleData(localeEsAR, 'es-Ar');



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
import { CustomPreloaderComponent } from './shared/components/custom-preloader/custom-preloader.component';
import { PopupArticuloConsultaComponent } from './shared/components/popups/popup-articulo-consulta/popup-articulo-consulta.component';
import { PopupInsumoConsultaComponent } from './shared/components/popups/popup-insumo-consulta/popup-insumo-consulta.component';
// tslint:disable-next-line: max-line-length
import { PopupArticuloDistribucionConsultaComponent } from './shared/components/popups/popup-articulo-distribucion-consulta/popup-articulo-distribucion-consulta.component';
import { PopupUsuarioComponent } from './shared/components/popups/popup-usuario/popup-usuario.component';
import { MovimientoProduccionComponent } from './pages/produccion/movimiento-produccion/movimiento-produccion.component';
import { IngresoProduccionComponent } from './pages/produccion/ingreso-produccion/ingreso-produccion.component';
import { AsociarProduccionComponent } from './pages/produccion/popups/popup/asociar-produccion/asociar-produccion.component';
// tslint:disable-next-line: max-line-length
import { AsociarProduccionDetalleComponent } from './pages/produccion/popups/popup/asociar-produccion-detalle/asociar-produccion-detalle.component';
import { AsociarInsumoDetalleComponent } from './pages/produccion/popups/popup/asociar-insumo-detalle/asociar-insumo-detalle.component';
import { AsociarInsumoComponent } from './pages/produccion/popups/popup/asociar-insumo/asociar-insumo.component';
import { AsociarInsumoAltaComponent } from './pages/produccion/asociar-insumo/asociar-insumo-alta/asociar-insumo-alta.component';
import { PopupCalculdorPalletsComponent } from './shared/components/popups/popup-calculdor-pallets/popup-calculdor-pallets.component';
// tslint:disable-next-line: max-line-length
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

import { GrupoTrabajoComponent } from './pages/mantenimiento/grupo-trabajo/grupo-trabajo.component';
import { GrupoTrabajoEditarComponent } from './pages/mantenimiento/grupo-trabajo-editar/grupo-trabajo-editar.component';
import { GrupoTrabajoAsociarComponent } from './pages/mantenimiento/grupo-trabajo-asociar/grupo-trabajo-asociar.component';
import { GrupoTrabajoAsociarEditarComponent } from './pages/mantenimiento/grupo-trabajo-asociar-editar/grupo-trabajo-asociar-editar.component';
import { UsuarioModuloComponent } from './pages/mantenimiento/usuario-modulo/usuario-modulo.component';
import { MaquinaComponent } from './pages/mantenimiento/maquina/maquina.component';
import { MaquinaEditarComponent } from './pages/mantenimiento/maquina-editar/maquina-editar.component';
import { InsumoAltaComponent } from './pages/insumo/insumo-alta/insumo-alta.component';
import { PopupInsumoAltaComponent } from './pages/insumo/insumo-alta/popup-insumo-alta/popup-insumo-alta.component';
import { CalidadControlEncabezadoComponent } from './pages/mantenimiento/calidad/calidad-control-encabezado/calidad-control-encabezado.component';
import { CalidadControlParametroComponent } from './pages/mantenimiento/calidad/calidad-control-parametro/calidad-control-parametro.component';
import { CalidadControlEncabezadoParametroComponent } from './pages/mantenimiento/calidad/calidad-control-encabezado-parametro/calidad-control-encabezado-parametro.component';
import { PopupCalidadControlEncabezadoParametroComponent } from './pages/mantenimiento/calidad/calidad-control-encabezado-parametro/popup-calidad-control-encabezado-parametro/popup-calidad-control-encabezado-parametro.component';
import { PopupControlParametroComponent } from './pages/mantenimiento/calidad/calidad-control-parametro/popup-control-parametro/popup-control-parametro.component';
import { PopupControlEncabezadoComponent } from './pages/mantenimiento/calidad/calidad-control-encabezado/popup-control-encabezado/popup-control-encabezado.component';
import { PopupFindCalidadParametroComponent } from './pages/mantenimiento/calidad/calidad-control-encabezado-parametro/popup-find-calidad-parametro/popup-find-calidad-parametro.component';
import { CalidadConsultaProduccionComponent } from './pages/calidad/calidad-consulta-produccion/calidad-consulta-produccion.component';
import { PopupCalidadParametroProduccionIngresoComponent } from './pages/calidad/popup-calidad-parametro-produccion-ingreso/popup-calidad-parametro-produccion-ingreso.component';
import { GrupoAnalisisComponent } from './pages/mantenimiento/grupo-analisis/grupo-analisis.component';
import { GrupoAnalisisEditarComponent } from './pages/mantenimiento/grupo-analisis-editar/grupo-analisis-editar.component';
import { PopupCalidadAsociadaProduccionComponent } from './pages/calidad/popup-calidad-asociada-produccion/popup-calidad-asociada-produccion.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CalidadProduccionProcesoComponent } from './pages/calidad/calidad-produccion-proceso/calidad-produccion-proceso.component';
import { PopupCalidadDetalleProcesoComponent } from './pages/calidad/popup-calidad-detalle-proceso/popup-calidad-detalle-proceso.component';
import { PopupCalidadDetalleProcesoControlComponent } from './pages/calidad/popup-calidad-detalle-proceso/popup-calidad-detalle-proceso-control/popup-calidad-detalle-proceso-control.component';
import { MobilControlCalidadConsultaComponent } from './pages/mobil/calidad/mobil-control-calidad-consulta/mobil-control-calidad-consulta.component';
import { MobilInsumoDetalleComponent } from './pages/mobil/stock/mobil-insumo-detalle/mobil-insumo-detalle.component';
import { MobilInsumoMovimientoComponent } from './pages/mobil/stock/mobil-insumo-movimiento/mobil-insumo-movimiento.component';
import { CalidadConsultaLineaComponent } from './pages/calidad/calidad-consulta-linea/calidad-consulta-linea.component';
import { PopupCalidadDetalleLineaComponent } from './pages/calidad/popup-calidad-detalle-linea/popup-calidad-detalle-linea.component';
import { OrdenPedidoComponent } from './pages/ventas/orden-pedido/orden-pedido.component';
import { PopupOrdenPedidoDetalleComponent } from './pages/ventas/popup-orden-pedido-detalle/popup-orden-pedido-detalle.component';
import { PopupOrdenPedidoStockComponent } from './pages/ventas/popup-orden-pedido-stock/popup-orden-pedido-stock.component';
import { PopupOrdenPedidoAsociarProductoComponent } from './pages/ventas/popup-orden-pedido-asociar-producto/popup-orden-pedido-asociar-producto.component';
import { PopupVentasEstadisticaProduccionComponent } from './pages/ventas/estadistica/popup-ventas-estadistica-produccion/popup-ventas-estadistica-produccion.component';
import { PopupVentasEstadisticaStockComponent } from './pages/ventas/estadistica/popup-ventas-estadistica-stock/popup-ventas-estadistica-stock.component';
import { OrdenPedidoConsultaStockComponent } from './pages/ventas/orden-pedido-consulta-stock/orden-pedido-consulta-stock.component';
import { InsumoStockComponent } from './pages/insumo/insumo-stock/insumo-stock.component';
import { PopUpInsumoStockComponent } from './pages/insumo/insumo-stock/popup-insumo-stock/popup-insumo-stock.component';
import { PopupInsumoStockDetalleProduccionComponent } from './pages/insumo/insumo-stock/popup-insumo-stock-detalle-produccion/popup-insumo-stock-detalle-produccion.component';
import { DepositoComponent } from './pages/mantenimiento/deposito/deposito.component';
import { DepositoEditarComponent } from './pages/mantenimiento/deposito-editar/deposito-editar.component';
import { NotificacionPersonalComponent } from './pages/mantenimiento/notificacion-personal/notificacion-personal.component';
import { PopupInsumoListadoComponent } from './pages/insumo/popup-insumo-listado/popup-insumo-listado.component';
import { PopupAsociarInsumoStockComponent } from './pages/produccion/popups/popup-asociar-insumo-stock/popup-asociar-insumo-stock.component';
import { UsuarioPasswordComponent } from './pages/mantenimiento/usuario-password/usuario-password.component';
import { PopupChartBarComponent } from './shared/popups/popup-chart-bar/popup-chart-bar.component';
import { PopupChartLineComponent } from './shared/popups/popup-chart-line/popup-chart-line.component';



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
    CustomPreloaderComponent,
    PopupArticuloConsultaComponent,
    PopupInsumoConsultaComponent,
    PopupArticuloDistribucionConsultaComponent,
    PopupUsuarioComponent,
    MovimientoProduccionComponent,
    IngresoProduccionComponent,
    AsociarProduccionComponent,
    AsociarProduccionDetalleComponent,
    AsociarInsumoDetalleComponent,
    AsociarInsumoComponent,
    AsociarInsumoAltaComponent,
    PopupCalculdorPalletsComponent,
    ParametrosComponent,
    OrdenProduccionComponent,
    ProduccionProcesoComponent,
    PopupArticuloConfeccionInsumoComponent,
    PopupInsumoAsociarArticuloComponent,
    PopOrdenProduccionEditarComponent,
    PopUpOrdenProduccionDetalleEditarComponent,
    PopupOrdenProduccionDetalleConsultaComponent,
    PopupAsociarProduccionComponent,
    GrupoTrabajoComponent,
    GrupoTrabajoEditarComponent,
    GrupoTrabajoAsociarComponent,
    GrupoTrabajoAsociarEditarComponent,
    UsuarioModuloComponent,
    MaquinaComponent,
    MaquinaEditarComponent,
    InsumoAltaComponent,
    PopupInsumoAltaComponent,
    CalidadControlEncabezadoComponent,
    CalidadControlParametroComponent,
    CalidadControlEncabezadoParametroComponent,
    PopupCalidadControlEncabezadoParametroComponent,
    PopupControlParametroComponent,
    PopupControlEncabezadoComponent,
    PopupFindCalidadParametroComponent,
    CalidadConsultaProduccionComponent,
    PopupCalidadParametroProduccionIngresoComponent,
    GrupoAnalisisComponent,
    GrupoAnalisisEditarComponent,
    PopupCalidadAsociadaProduccionComponent,
    CalidadProduccionProcesoComponent,
    PopupCalidadDetalleProcesoComponent,
    PopupCalidadDetalleProcesoControlComponent,
    MobilControlCalidadConsultaComponent,
    MobilInsumoDetalleComponent,
    MobilInsumoMovimientoComponent,
    CalidadConsultaLineaComponent,
    PopupCalidadDetalleLineaComponent,
    OrdenPedidoComponent,
    PopupOrdenPedidoDetalleComponent,
    PopupOrdenPedidoStockComponent,
    PopupOrdenPedidoAsociarProductoComponent,
    PopupVentasEstadisticaProduccionComponent,
    PopupVentasEstadisticaStockComponent,
    OrdenPedidoConsultaStockComponent,
    InsumoStockComponent,
    PopUpInsumoStockComponent,
    PopupInsumoStockDetalleProduccionComponent,
    DepositoComponent,
    DepositoEditarComponent,
    NotificacionPersonalComponent,
    PopupInsumoListadoComponent,
    PopupAsociarInsumoStockComponent,
    LoginComponent,
    UsuarioPasswordComponent,
    PopupChartBarComponent,
    PopupChartLineComponent
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
    ChartModule,
    OverlayPanelModule,
    DynamicDialogModule,
    OrderListModule,
    InputTextareaModule,
    ScrollPanelModule,
    ProgressSpinnerModule,
    InputSwitchModule,
    PanelModule,
    SelectButtonModule,
    ColorPickerModule,
    ToggleButtonModule,
    AutoCompleteModule,
    KeyFilterModule,
    DataViewModule,
    CardModule,
    RatingModule,
    PivotViewModule ,
    SweetAlert2Module.forRoot(),
    AutofocusModule,
    NgxPopper,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })

  ],
  entryComponents: [ArticuloEditarComponent,
     ArticuloConfeccionEditarComponent,
     InsumoEditarComponent,
     UsuarioEditarComponent,
     UnidadEditarComponent,
     DepositoEditarComponent,

/* -------------------------------------------------------------------------- */
/*                        ASOCIAR PRODUCCION Y INSUMOS                        */
/* -------------------------------------------------------------------------- */

     AsociarProduccionComponent,
     AsociarProduccionDetalleComponent,
     AsociarInsumoDetalleComponent,
     AsociarInsumoComponent,
     AsociarInsumoAltaComponent,
     PopupArticuloConfeccionInsumoComponent,
     PopupInsumoAsociarArticuloComponent,
     PopOrdenProduccionEditarComponent,
     PopUpOrdenProduccionDetalleEditarComponent,
     PopupOrdenProduccionDetalleConsultaComponent,
     PopupAsociarProduccionComponent,
     MaquinaEditarComponent,
     UsuarioModuloComponent,
     GrupoAnalisisEditarComponent,

/* -------------------------------------------------------------------------- */
/*                             CONTROL DE CALIDAD                             */
/* -------------------------------------------------------------------------- */

PopupCalidadControlEncabezadoParametroComponent,
PopupControlParametroComponent,
PopupControlEncabezadoComponent,
PopupFindCalidadParametroComponent,
PopupCalidadParametroProduccionIngresoComponent,
PopupCalidadAsociadaProduccionComponent,
PopupCalidadDetalleProcesoComponent,
PopupCalidadDetalleProcesoControlComponent,
PopupCalidadDetalleLineaComponent,

/* -------------------------------------------------------------------------- */
/*                                   INSUMOS                                  */
/* -------------------------------------------------------------------------- */

PopupInsumoAltaComponent,
PopUpInsumoStockComponent,
PopupInsumoStockDetalleProduccionComponent,
PopupInsumoListadoComponent,

/* -------------------------------------------------------------------------- */
/*                                   VENTAS                                   */
/* -------------------------------------------------------------------------- */
PopupOrdenPedidoDetalleComponent,
PopupOrdenPedidoStockComponent,
PopupOrdenPedidoAsociarProductoComponent,
PopupVentasEstadisticaProduccionComponent,
PopupVentasEstadisticaStockComponent,
PopupAsociarInsumoStockComponent,

/* -------------------------------------------------------------------------- */
/*                                    MOBIL                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                    GRAFICOS                                */
/* -------------------------------------------------------------------------- */

PopupChartBarComponent,
PopupChartLineComponent,

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

