import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { EmptyComponent } from './pages/info/empty/empty.component';
import { NotFoundComponent } from './pages/info/not-found/not-found.component';
import { ProduccionindicadoresComponent } from './pages/produccion/produccionindicadores/produccionindicadores.component';
import { CalidadindicadoresComponent } from './pages/calidad/calidadindicadores/calidadindicadores.component';
import { LoginComponent } from './login/login.component';
import { ArticuloComponent } from './pages/mantenimiento/articulo/articulo.component';
import { ArticuloConfeccionComponent } from './pages/mantenimiento/articulo-confeccion/articulo-confeccion.component';
import { InsumoComponent } from './pages/mantenimiento/insumo/insumo.component';
import { UsuarioComponent } from './pages/mantenimiento/usuario/usuario.component';
import { MovimientoProduccionComponent } from './pages/produccion/movimiento-produccion/movimiento-produccion.component';
import { IngresoProduccionComponent } from './pages/produccion/ingreso-produccion/ingreso-produccion.component';
import { OrdenProduccionComponent } from './pages/produccion/orden-produccion/orden-produccion.component';
import { UnidadComponent } from './pages/mantenimiento/unidad/unidad.component';
import { GrupoTrabajoComponent } from './pages/mantenimiento/grupo-trabajo/grupo-trabajo.component';
import { GrupoTrabajoEditarComponent } from './pages/mantenimiento/grupo-trabajo-editar/grupo-trabajo-editar.component';
import { GrupoTrabajoAsociarComponent } from './pages/mantenimiento/grupo-trabajo-asociar/grupo-trabajo-asociar.component';
import { ProduccionProcesoComponent } from './pages/produccion/produccion-proceso/produccion-proceso.component';
import { MaquinaComponent } from './pages/mantenimiento/maquina/maquina.component';
import { AsociarInsumoAltaComponent } from './pages/produccion/asociar-insumo/asociar-insumo-alta/asociar-insumo-alta.component';
import { InsumoAltaComponent } from './pages/insumo/insumo-alta/insumo-alta.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

import { CalidadControlEncabezadoComponent } from './pages/mantenimiento/calidad/calidad-control-encabezado/calidad-control-encabezado.component';
import { CalidadControlParametroComponent } from './pages/mantenimiento/calidad/calidad-control-parametro/calidad-control-parametro.component';
import { CalidadControlEncabezadoParametroComponent } from './pages/mantenimiento/calidad/calidad-control-encabezado-parametro/calidad-control-encabezado-parametro.component';
import { GrupoAnalisisComponent } from './pages/mantenimiento/grupo-analisis/grupo-analisis.component';
import { CalidadConsultaProduccionComponent } from './pages/calidad/calidad-consulta-produccion/calidad-consulta-produccion.component';
import { CalidadProduccionProcesoComponent } from './pages/calidad/calidad-produccion-proceso/calidad-produccion-proceso.component';
import { CalidadConsultaLineaComponent } from './pages/calidad/calidad-consulta-linea/calidad-consulta-linea.component';
import { MobilControlCalidadConsultaComponent } from './pages/mobil/calidad/mobil-control-calidad-consulta/mobil-control-calidad-consulta.component';
import { MobilInsumoDetalleComponent } from './pages/mobil/stock/mobil-insumo-detalle/mobil-insumo-detalle.component';
import { OrdenPedidoComponent } from './pages/ventas/orden-pedido/orden-pedido.component';
import { OrdenPedidoConsultaStockComponent } from './pages/ventas/orden-pedido-consulta-stock/orden-pedido-consulta-stock.component';
import { InsumoStockComponent } from './pages/insumo/insumo-stock/insumo-stock.component';
import { DepositoComponent } from './pages/mantenimiento/deposito/deposito.component';
import { NotificacionPersonalComponent } from './pages/mantenimiento/notificacion-personal/notificacion-personal.component';
import { UsuarioPasswordComponent } from './pages/mantenimiento/usuario-password/usuario-password.component';

const routes: Routes = [





/* -------------------------------------------------------------------------- */
/*                              PAGINAS DEL SITIO                             */
/* -------------------------------------------------------------------------- */
  { path: 'login', component: LoginComponent },
  { path: '404', component: NotFoundComponent },
  { path: '',
    component: NavbarComponent,
    children: [



/* -------------------------------------------------------------------------- */
/*                                MANTENIMIENTO                               */
/* -------------------------------------------------------------------------- */

{ path: 'mantenimiento/articulo', component: ArticuloComponent ,canActivate: [AuthGuard], data: {role: 'administracion_produccion'}},
{ path: 'mantenimiento/articulo/confeccion', component: ArticuloConfeccionComponent },
{ path: 'mantenimiento/unidad', component: UnidadComponent },
{ path: 'mantenimiento/grupo/analisis', component: GrupoAnalisisComponent },
{ path: 'mantenimiento/insumo', component: InsumoComponent },
{ path: 'mantenimiento/deposito', component: DepositoComponent },
{ path: 'mantenimiento/grupo', component: GrupoTrabajoComponent },
{ path: 'usuario', component: UsuarioComponent },
{ path: 'usuario/password', component: UsuarioPasswordComponent },
{ path: 'mantenimiento/lineas/produccion', component: MaquinaComponent },

{ path: 'mantenimiento/calidad/encabezado', component: CalidadControlEncabezadoComponent },
{ path: 'mantenimiento/calidad/parametro', component: CalidadControlParametroComponent },
{ path: 'mantenimiento/calidad/encabezado/parametro', component: CalidadControlEncabezadoParametroComponent },
{ path: 'mantenimiento/notificaciones/personal', component: NotificacionPersonalComponent },


/* -------------------------------------------------------------------------- */
/*                                   CALIDAD                                  */
/* -------------------------------------------------------------------------- */

{ path: 'calidad/indicadores', component: CalidadindicadoresComponent ,canActivate: [AuthGuard], data: {role: 'administarcion_auditoria'}},
{ path: 'control/calidad', component: CalidadConsultaProduccionComponent ,canActivate: [AuthGuard], data: {role: 'administarcion_auditoria'}},
{ path: 'control/linea', component: CalidadConsultaLineaComponent ,canActivate: [AuthGuard], data: {role: 'administarcion_auditoria'}},
{ path: 'control/calidad/produccion', component: CalidadProduccionProcesoComponent ,canActivate: [AuthGuard], data: {role: 'administarcion_auditoria'}},

/* -------------------------------------------------------------------------- */
/*                                 PRODUCCION                                 */
/* -------------------------------------------------------------------------- */

{ path: 'produccion/indicadores', component: ProduccionindicadoresComponent },
{ path: 'orden/produccion', component: OrdenProduccionComponent },
{ path: 'produccion/ingreso', component: IngresoProduccionComponent },
{ path: 'produccion/movimientos', component: MovimientoProduccionComponent },
{ path: 'produccion/asociar/insumo', component: AsociarInsumoAltaComponent },
{ path: 'produccion/proceso', component: ProduccionProcesoComponent },


/* -------------------------------------------------------------------------- */
/*                                   INSUMOS                                  */
/* -------------------------------------------------------------------------- */
{ path: 'insumo/stock/ingreso', component: InsumoAltaComponent },
{ path: 'insumo/stock', component: InsumoStockComponent },


/* -------------------------------------------------------------------------- */
/*                                    MOVIL                                   */
/* -------------------------------------------------------------------------- */

{ path: 'movil/control/calidad', component: MobilControlCalidadConsultaComponent },
{ path: 'movil/insumo/stock/ingreso', component: MobilInsumoDetalleComponent },

/* -------------------------------------------------------------------------- */
/*                                   VENTAS                                   */
/* -------------------------------------------------------------------------- */

{ path: 'ventas/orden/pedido', component: OrdenPedidoComponent },
{ path: 'ventas/stock', component: OrdenPedidoConsultaStockComponent },
{ path: 'movil/insumo/stock/ingreso', component: MobilInsumoDetalleComponent },
{ path: 'movil/insumo/stock/ingreso', component: MobilInsumoDetalleComponent },

    ]
 },
  { path: '**', component: NavbarComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],























exports: [RouterModule]
})
export class AppRoutingModule { 

}
