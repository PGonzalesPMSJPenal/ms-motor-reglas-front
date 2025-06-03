import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConstructorReglaService } from './constructor-reglas.service';
import { BuilderRegla, CondicionRegla, Operador, ExpedienteTest, ResultadoSimulacion } from './modelo';

@Component({
  selector: 'app-constructor-reglas',
  templateUrl: './constructor-reglas.component.html',
  styleUrls: ['./constructor-reglas.component.scss']
})
export class ConstructorReglasComponent implements OnInit {
  catalogos: {[key: string]: string[]} = {};
  operadores: Operador[] = [];
  expedienteTestForm2: ExpedienteTest [] = [];
  reglaForm: FormGroup;
  expedienteTestForm: FormGroup;
  previewDrl: string = '';
  resultadoSimulacion: ResultadoSimulacion | null = null;
  // Control de pestañas
  tabIndex = 0;
  // Estado de carga
  cargando = false;
  constructor(
    private fb: FormBuilder,
    private constructorService: ConstructorReglaService,
    private snackBar: MatSnackBar
  ) {
    // Inicializar formularios
    this.reglaForm = this.crearReglaForm();
    this.expedienteTestForm = this.crearExpedienteTestForm();
  }
  
  ngOnInit(): void {
    this.cargarCatalogos();
    this.cargarOperadores();
    this.cargarExpedientes();
  }
  
  cargarCatalogos(): void {
    this.cargando = true;
    this.constructorService.obtenerCatalogos().subscribe({
      next: (data) => {
        this.catalogos = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar catálogos:', error);
        this.mostrarMensaje('Error al cargar catálogos', 'error');
        this.cargando = false;
      }
    });
  }

  cargarOperadores(): void {
    this.constructorService.obtenerOperadores().subscribe({
      next: (data) => {
        this.operadores = data;
      },
      error: (error) => {
        console.error('Error al cargar operadores:', error);
        this.mostrarMensaje('Error al cargar operadores', 'error');
      }
    });
  }

  cargarExpedientes(): void {
    this.constructorService.obtenerExpedientes().subscribe({
      next: (data) => {
        this.expedienteTestForm2 = data;
      },
      error: (error) => {
        console.error('Error al cargar expedientes:', error);
        this.mostrarMensaje('Error al cargar expedientes', 'error');
      }
    });
  }
  
  crearReglaForm(): FormGroup {
    return this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      especialidad: ['', Validators.required],
      descripcion: ['', Validators.required],
      prioridad: ['0', Validators.required],
      condicionesAdicionales: this.fb.array([]),
      bandejaDestino: ['', Validators.required],
      responsable: ['', Validators.required],
      usarDrlPersonalizado: [false],
      drlPersonalizado: ['']
    });
  }
  
  crearExpedienteTestForm(): FormGroup {
    return this.fb.group({
      numeroExpediente: [''],
      tipoResolucion: [''],
      actoProcesal: [''],
      sumilla: [''],
      bandejaOrigen: [''],
      bandejaSalida: [''],
    });
  }
  
  onExpedienteSeleccionado(expediente: ExpedienteTest): void {
    if (expediente) {
      this.expedienteTestForm.patchValue({
        numeroExpediente: expediente.numeroExpediente,
        actoProcesal: expediente.actoProcesal,
        tipoResolucion: expediente.tipoResolucion,
        sumilla: expediente.sumilla,
        bandejaOrigen: expediente.bandejaOrigen
      });
    } else {
      this.expedienteTestForm.patchValue({
        numeroExpediente: '',
        actoProcesal: '',
        sumilla: '',
        bandejaOrigen: ''
      });
    }
  }

  // Métodos para el formulario de condiciones
  get condicionesFormArray(): FormArray {
    return this.reglaForm.get('condicionesAdicionales') as FormArray;
  }
  
  crearCondicionFormGroup(): FormGroup {
    return this.fb.group({
      atributo: ['', Validators.required],
      operador: ['==', Validators.required],
      valor: [''],
      negacion: [false]
    });
  }
  
  agregarCondicion(): void {
    this.condicionesFormArray.push(this.crearCondicionFormGroup());
  }
  
  eliminarCondicion(index: number): void {
    this.condicionesFormArray.removeAt(index);
  }

  previsualizarDrl(): void {
    if (this.reglaForm.invalid) {
      this.mostrarMensaje('Por favor complete los campos requeridos', 'warning');
      return;
    }
    this.cargando = true;
    this.constructorService.previsualizarDrl(this.reglaForm.value).subscribe({
      next: (drl) => {
        this.previewDrl = drl;
        this.cargando = false;
        this.mostrarMensaje('DRL generado correctamente', 'success');
      },
      error: (error) => {
        console.error('Error al generar DRL:', error);
        this.mostrarMensaje('Error al generar DRL', 'error');
        this.cargando = false;
      }
    });
  }
  
  guardarRegla(): void {
    if (this.reglaForm.invalid) {
      this.mostrarMensaje('Por favor complete los campos requeridos', 'warning');
      return;
    }
    
    const regla: BuilderRegla = this.reglaForm.value;
    this.cargando = true;
    
    const operacion = regla.id ? 
      this.constructorService.actualizarRegla(regla) : 
      this.constructorService.crearRegla(regla);
      
    operacion.subscribe({
      next: (resultado) => {
        this.cargando = false;
        this.mostrarMensaje('Regla guardada correctamente', 'success');
        
        // Limpiar formulario
        this.reglaForm.reset({
          prioridad: 100,
          usarDrlPersonalizado: false
        });
        this.condicionesFormArray.clear();
        this.previewDrl = '';
        this.resultadoSimulacion = null;
      },
      error: (error) => {
        console.error('Error al guardar regla:', error);
        this.mostrarMensaje(`Error al guardar regla: ${error.error?.message || error.message}`, 'error');
        this.cargando = false;
      }
    });
  }
  
  simularRegla(): void {
    if (this.reglaForm.invalid) {
      this.mostrarMensaje('Por favor complete los campos requeridos', 'warning');
      return;
    }
    
    this.cargando = true;
    
    const simulacion = {
      builder: this.reglaForm.value,
      expedienteTest: this.expedienteTestForm.value
    };
    console.log('Datos enviados al backend:', simulacion);

    this.constructorService.simularRegla(simulacion).subscribe({
      next: (resultado) => {
        this.resultadoSimulacion = resultado;
        this.cargando = false;
        
        if (resultado.reglaAplicada) {
          this.mostrarMensaje('Simulación exitosa: Regla aplicada', 'success');
        } else if (resultado.tieneErrores) {
          this.mostrarMensaje(`Error en simulación: ${resultado.errores}`, 'error');
        } else {
          this.mostrarMensaje('Simulación completada: La regla no se aplicó', 'info');
        }
      },
      error: (error) => {
        console.error('Error en simulación:', error);
        this.mostrarMensaje('Error al ejecutar simulación', 'error');
        this.cargando = false;
      }
    });
  }
  
  limpiarFormulario(): void {
    this.reglaForm.reset({
      prioridad: 100,
      usarDrlPersonalizado: false
    });
    this.condicionesFormArray.clear();
    this.previewDrl = '';
    this.resultadoSimulacion = null;
  }
  
  mostrarMensaje(mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: [`snackbar-${tipo}`]
    });
  }
}