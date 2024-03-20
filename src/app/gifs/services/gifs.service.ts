// Importaciones necesarias para realizar peticiones HTTP y decorar la clase para inyección de dependencias
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Importación de interfaces para tipado de datos
import { Gif, SearchRespose } from '../interfaces/gifs.interfaces';

// Decorador que marca la clase como un servicio que puede ser inyectado, con un proveedor a nivel de raíz
@Injectable({
  providedIn: 'root',
})
export class GifsService {
  public gifList: Gif[] = []; // Almacena los GIFs obtenidos de la búsqueda actual
  private _tagHistory: string[] = []; // Historial privado de etiquetas (tags) buscadas
  private GHIPHY_APY_KEY: string = 'wK4ddnY5KVgeNqMYiUndqSPE6c4efWQA'; // Clave API de Giphy
  private serviceURL: string = 'https://api.giphy.com/v1/gifs'; // URL base del servicio Giphy

  // Constructor del servicio, inyecta el cliente HTTP de Angular
  constructor(private http: HttpClient) {
    this.loadLocalStorage(); // Carga el historial de búsquedas del localStorage al iniciar
    this.mostarUltimaBusqueda(); // Muestra los resultados de la última búsqueda al iniciar
  }

  // Getter público para acceder al historial de etiquetas de manera segura
  public get tagHistory(): string[] {
    return [...this._tagHistory];
  }

  // Setter para actualizar el historial de etiquetas de manera controlada
  public set tagHistory(value: string[]) {
    this._tagHistory = value;
  }

  // Organiza el historial de etiquetas, evitando duplicados y limitando su tamaño a 10
  private organizeHistory(tag: string) {
    tag = tag.toLowerCase(); // Normaliza la etiqueta a minúsculas
    // Elimina la etiqueta si ya existe, para reinsertarla al inicio
    if (this.tagHistory.includes(tag)) {
      this._tagHistory = this.tagHistory.filter((oldTag) => oldTag !== tag);
    }
    this._tagHistory.unshift(tag); // Inserta la nueva etiqueta al inicio
    this.tagHistory = this._tagHistory.splice(0, 10); // Limita el historial a 10 etiquetas
    this.saveLocalStorage(); // Guarda el historial actualizado en localStorage
  }

  // Realiza la búsqueda de GIFs por etiqueta, actualizando la lista de GIFs y el historial
  searchTag(tag: string): void {
    if (tag.length === 0) return; // Evita búsquedas vacías
    this.organizeHistory(tag); // Organiza el historial con la nueva etiqueta
    const params = new HttpParams() // Prepara los parámetros de la petición
      .set('api_key', this.GHIPHY_APY_KEY)
      .set('limit', 10)
      .set('q', tag);

    // Realiza la petición HTTP GET y actualiza `gifList` con los resultados
    this.http
      .get<SearchRespose>(`${this.serviceURL}/search`, { params: params })
      .subscribe((resp) => {
        this.gifList = resp.data; // Actualiza la lista de GIFs con la respuesta
      });
  }

  // Guarda el historial de búsquedas en localStorage
  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagHistory));
  }

  // Carga el historial de búsquedas desde localStorage
  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return; // Si no hay historial, termina
    this._tagHistory = JSON.parse(localStorage.getItem('history')!); // Carga y parsea el historial
  }

  // Busca los GIFs de la última etiqueta buscada al iniciar el servicio
  private mostarUltimaBusqueda() {
    if (this._tagHistory.length > 0) {
      this.searchTag(this.tagHistory[0]); // Realiza la búsqueda de la última etiqueta
    }
  }
}
