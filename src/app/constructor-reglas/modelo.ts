export interface BuilderRegla {
  id?: number;
  nombre: string;
  especialidad: string;
  descripcion: string;
  prioridad: number;
  condicionesAdicionales: CondicionRegla[];
  bandejaDestino: string;
  responsable: string;
  usarDrlPersonalizado: boolean;
  drlPersonalizado: string;
}

  export interface CondicionRegla {
  atributo: string;
  operador: string;
  valor: string;
  negacion: boolean;
  etiquetaAtributo?: string;
  descripcionAtributo?: string;
  }
  
  export interface Operador {
  codigo: string;
  simbolo: string;
  nombre: string;
  descripcion: string;
  requiereValor: boolean;
  tipoValor: string;
  permiteNegacion: boolean;
  }
  
  export interface ExpedienteTest {
  numeroExpediente: string;
  tipoResolucion: string;
  actoProcesal: string;
  sumilla: string;
  bandejaOrigen: string;
  bandejaSalida: string;
  }
  
  export interface SimulacionRegla {
  builder: BuilderRegla;
  expedienteTest: ExpedienteTest;
  }
  
  export interface ResultadoSimulacion {
  reglaAplicada: boolean;
  bandejaResultante?: string;
  drlGenerado?: string;
  mensaje: string;
  tieneErrores: boolean;
  errores?: string;
  }