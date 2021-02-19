import { Component, OnInit } from '@angular/core';
import { AlertServiceService } from '../../../services/alert-service.service';
import { ArticuloService } from './../../../services/articulo.service';
import { MessageService, DialogService } from 'primeng/api';
import { ArticuloEditarComponent } from './../articulo-editar/articulo-editar.component';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.scss'],
  providers: [MessageService, DialogService]
})
export class ArticuloComponent implements OnInit {

  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;
  userData: any;

  // tslint:disable-next-line: max-line-length
  constructor(private alertServiceService: AlertServiceService, private articuloService: ArticuloService, public dialogService: DialogService, private messageService: MessageService) {

    this.cols = [
      { field: 'nombre', header: 'Producto',  width: '30%' },
      { field: 'descripcion', header: 'Descripción',  width: '35%' },
      { field: 'unidad_descripcion', header: 'Unidad',  width: '25%' },
      { field: 'unidades', header: 'Unidades',  width: '8%' },
      { field: 'pallet_pisos', header: 'Pisos',  width: '8%' },
      { field: 'pallet_pack', header: 'Pack',  width: '8%' },
      { field: 'unidad_hora', header: 'U/h',  width: '8%' },
      { field: 'volumen', header: 'Volumen',  width: '8%' },
      { field: '', header: '',  width: '6%' },

   ];
  }

  ngOnInit() {
   this.userData = JSON.parse(localStorage.getItem('userData'));
   // this.alertServiceService.throwAlert('success','Articulo guardado','','201');
   this.loadlist();
  }


  loadlist() {

    this.loading = true;
    try {
        this.articuloService.getArticulo()
        .subscribe(resp => {
          if (resp[0]) {
            this.elementos = resp;
            console.log(this.elementos);
              } else {
                this.elementos = null;
              }
          this.loading = false;
          console.log(resp);
        },
        error => { // error path
            console.log(error);
            this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
         });
    } catch (error) {
      this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
    }
}

buscar(elemento: any) {
  console.log(elemento);
  let data: any;
  data = elemento;
  const ref = this.dialogService.open(ArticuloEditarComponent, {
  data,
   header: 'Editar artículo',
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe(() => {
        this.loadlist();
  });

}


nuevo() {
  const data: any = null;
  const ref = this.dialogService.open(ArticuloEditarComponent, {
  data,
   header: 'Editar artículo',
   width: '98%',
   height: '90%'
  });
  ref.onClose.subscribe(() => {
        this.loadlist();
  });
}

}
