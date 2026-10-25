
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export interface Publicacion {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  foto: string;
}

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {

  private clave = 'publicaciones';
  private claveInicializada = 'publicaciones_inicializadas';

  private publicacionesIniciales: Publicacion[] = [
    {
      id: 'ejemplo-1',
      titulo: 'Mascota perdida',
      descripcion: 'Mascota perdida.',
      fecha: '2024-01-18T12:00:00',
      foto: 'assets/imagenes/mascota-perdida.jpg'
    },
    {
      id: 'ejemplo-2',
      titulo: 'Cédula encontrada',
      descripcion: 'Cédula encontrada.',
      fecha: '2024-01-09T12:00:00',
      foto: 'assets/imagenes/cedula-encontrada.jpg'
    }
  ];

  async obtenerPublicaciones(): Promise<Publicacion[]> {
    const { value } = await Preferences.get({
      key: this.clave
    });

    let publicaciones: Publicacion[] = [];

    if (value) {
      try {
        const datos = JSON.parse(value);

        if (Array.isArray(datos)) {
          publicaciones = datos;
        }
      } catch {
        publicaciones = [];
      }
    }

    const { value: inicializada } = await Preferences.get({
      key: this.claveInicializada
    });

    if (inicializada !== 'si') {
      const ids = new Set(
        publicaciones.map(publicacion => publicacion.id)
      );

      for (const inicial of this.publicacionesIniciales) {
        if (!ids.has(inicial.id)) {
          publicaciones.push(inicial);
        }
      }

      await Preferences.set({
        key: this.claveInicializada,
        value: 'si'
      });
    }

    const unicas = new Map<string, Publicacion>();

    for (const publicacion of publicaciones) {
      if (publicacion && publicacion.id) {
        unicas.set(publicacion.id, publicacion);
      }
    }

    const resultado = Array.from(unicas.values());

    await Preferences.set({
      key: this.clave,
      value: JSON.stringify(resultado)
    });

    return resultado;
  }

  async guardarPublicacion(
    publicacion: Publicacion
  ): Promise<void> {
    const publicaciones = await this.obtenerPublicaciones();

    if (!publicaciones.some(p => p.id === publicacion.id)) {
      publicaciones.push(publicacion);
    }

    await Preferences.set({
      key: this.clave,
      value: JSON.stringify(publicaciones)
    });
  }

  async eliminarPublicacion(id: string): Promise<void> {
    const publicaciones = await this.obtenerPublicaciones();

    const actualizadas = publicaciones.filter(
      publicacion => publicacion.id !== id
    );

    await Preferences.set({
      key: this.clave,
      value: JSON.stringify(actualizadas)
    });
  }
}
