import { Injectable } from '@angular/core';
import { Camera, CameraPhoto, CameraResultType, CameraSource } from '../../../node_modules/@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '../../../node_modules/@capacitor/storage';
import { Photo } from './photo.model';

@Injectable({
  providedIn: 'root'
})


export class PhotoService {
  public photos: Photo[] = []

  private async savePicture(cameraPhoto: CameraPhoto) { 
    const base64Data = await this.readAsBase64(cameraPhoto);
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });
    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath
    }
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
    const response = await
    fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
  }
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);
  }

  
  constructor() { }
}
