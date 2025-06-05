import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BuilderRegla, Operador, SimulacionRegla, ResultadoSimulacion, ExpedienteTest } from './modelo';

@Injectable({
  providedIn: 'root'
})
export class ConstructorReglaService {
  private baseUrl = 'http://192.168.31.81:1705/api/reglas';
  constructor(private http: HttpClient) { }

  obtenerCatalogos(): Observable<{[key: string]: string[]}> {
    return this.http.get<{[key: string]: string[]}>(`${this.baseUrl}/catalogos`);
  }

  obtenerOperadores(): Observable<Operador[]> {
    return this.http.get<Operador[]>(`${this.baseUrl}/operadores`);
  }

  obtenerExpedientes(): Observable<ExpedienteTest[]>{
    return this.http.get<ExpedienteTest[]>(`${this.baseUrl}/expediente`);
  }

  previsualizarDrl(regla: BuilderRegla): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/previsualizar-drl`, regla, {
      responseType: 'text' as 'json'
    });
  }

  crearRegla(regla: BuilderRegla, usuario: string = 'admin'): Observable<BuilderRegla> {
    const params = new HttpParams().set('usuario', usuario);
    return this.http.post<BuilderRegla>(`${this.baseUrl}`, regla, { params });
  }

  actualizarRegla(regla: BuilderRegla, usuario: string = 'admin'): Observable<BuilderRegla> {
    const params = new HttpParams().set('usuario', usuario);
    return this.http.put<BuilderRegla>(`${this.baseUrl}/${regla.id}`, regla, { params });
  }

  obtenerReglaPorId(id: number): Observable<BuilderRegla> {
    return this.http.get<BuilderRegla>(`${this.baseUrl}/${id}`);
  }

  simularRegla(simulacion: SimulacionRegla): Observable<ResultadoSimulacion> {
    return this.http.post<ResultadoSimulacion>(`${this.baseUrl}/simular`, simulacion);
  }
}