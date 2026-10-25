
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FechaPipe } from '../pipes/fecha.pipe';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonIcon
} from '@ionic/angular';

import {
  PublicacionService,
  Publicacion
} from '../services/publicacion.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonIcon,
    RouterLink,
    FechaPipe
  ],
})
export class HomePage {

  publicaciones: Publicacion[] = [
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

  constructor(
    private publicacionService: PublicacionService
  ) {
    addIcons({ trashOutline });
  }

  async ionViewWillEnter() {
    await this.cargarPublicaciones();
  }

  async cargarPublicaciones() {
    try {
      const guardadas =
        await this.publicacionService.obtenerPublicaciones();

      const unicas = new Map<string, Publicacion>();

      for (const publicacion of guardadas) {
        if (publicacion && publicacion.id) {
          unicas.set(publicacion.id, publicacion);
        }
      }

      this.publicaciones = Array.from(unicas.values());
    } catch (error) {
      console.error(
        'Error al cargar publicaciones:',
        error
      );
    }
  }

  async eliminarPublicacion(id: string) {
    const confirmar = window.confirm(
      '¿Estás seguro de que quieres eliminar esta publicación?'
    );

    if (!confirmar) {
      return;
    }

    try {
      await this.publicacionService.eliminarPublicacion(id);
      await this.cargarPublicaciones();
    } catch (error) {
      console.error(
        'Error al eliminar la publicación:',
        error
      );
    }
  }
}
