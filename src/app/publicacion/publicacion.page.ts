
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButtons,
  IonBackButton,
  IonIcon
} from '@ionic/angular';

import {
  Camera,
  CameraResultType,
  CameraSource
} from '@capacitor/camera';

import { PublicacionService } from '../services/publicacion.service';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.page.html',
  styleUrls: ['./publicacion.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButtons,
    IonBackButton,
    IonIcon
  ]
})
export class PublicacionPage {
  titulo: string = '';
  descripcion: string = '';
  mensaje: string = '';

  foto: string = 'assets/imagenes/mascota-perdida.jpg';
  fotoCapturada: boolean = false;

  constructor(
    private publicacionService: PublicacionService
  ) {}

  async tomarFoto() {
    try {
      if (Capacitor.isNativePlatform()) {
        const imagen = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera
        });

        if (imagen.dataUrl) {
          this.foto = imagen.dataUrl;
          this.fotoCapturada = true;
          this.mensaje = 'Fotografía capturada correctamente.';
        }
      } else {
        const flujo = await navigator.mediaDevices.getUserMedia({
          video: true
        });

        const video = document.createElement('video');
        video.srcObject = flujo;
        video.autoplay = true;
        video.playsInline = true;

        await video.play();

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const contexto = canvas.getContext('2d');

        if (contexto) {
          contexto.drawImage(video, 0, 0);
          this.foto = canvas.toDataURL('image/jpeg', 0.8);
          this.fotoCapturada = true;
          this.mensaje = 'Fotografía capturada correctamente.';
        }

        flujo.getTracks().forEach(track => track.stop());
      }
    } catch (error) {
      console.error('No se pudo tomar la fotografía:', error);
      this.mensaje = 'No se pudo acceder a la cámara. Comprueba los permisos.';
    }
  }

  async guardarPublicacion() {
    this.mensaje = '';

    if (this.titulo.trim().length < 5) {
      this.mensaje = 'El título debe tener al menos 5 caracteres.';
      return;
    }

    if (this.descripcion.trim().length < 20) {
      this.mensaje = 'La descripción debe tener al menos 20 caracteres.';
      return;
    }

    const nuevaPublicacion = {
      id: Date.now().toString(),
      titulo: this.titulo.trim(),
      descripcion: this.descripcion.trim(),
      fecha: new Date().toISOString(),
      foto: this.foto
    };

    try {
      await this.publicacionService.guardarPublicacion(
        nuevaPublicacion
      );

      this.mensaje = '¡Publicación guardada correctamente!';

      this.titulo = '';
      this.descripcion = '';
      this.foto = 'assets/imagenes/mascota-perdida.jpg';
      this.fotoCapturada = false;
    } catch (error) {
      console.error('Error al guardar la publicación:', error);
      this.mensaje = 'No se pudo guardar la publicación. Inténtalo de nuevo.';
    }
  }
}
