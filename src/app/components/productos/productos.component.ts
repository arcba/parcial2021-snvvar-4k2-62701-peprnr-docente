import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  Titulo = 'Productos';
  TituloAccionABMC = {
    A: '(Agregar)',
    L: '(Listado)'
  };
  AccionABMC = 'L'; // inicialmente inicia en el listado de articulos (buscar con parametros)
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };

  Items: Producto[] = null;
  submitted: boolean = false;

  FormRegistro: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private productosService: ProductosService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.FormRegistro = this.formBuilder.group({
      ProductoId: [0],
      ProductoNombre: ['', [Validators.required, Validators.maxLength(50)]],
      ProductoStock: [
        '',
        [Validators.required, Validators.pattern('[0-9]{1,7}')]
      ],
      ProductoFechaAlta: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ]
    });

    this.GetProductos();
  }

  Agregar() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset({ ProductoId: 0 });
    this.submitted = false;
    this.FormRegistro.markAsUntouched();
  }

  GetProductos() {
    this.productosService.get().subscribe((res: any) => {
      this.Items = res;
    });
  }

  // grabar tanto altas como modificaciones
  Grabar() {
    this.submitted = true;
    if (this.FormRegistro.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.ProductoFechaAlta.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.ProductoFechaAlta = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    this.productosService.post(itemCopy).subscribe((res: any) => {
      this.Volver();
      this.modalDialogService.Alert('Registro agregado correctamente.');
      this.GetProductos();
    });
  }

  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = 'L';
  }
}
