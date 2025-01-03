import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  signal,
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { PhotoCardComponent } from 'src/app/shared/components/photo-card/photo-card.component';
import { PhotoService } from 'src/app/core/services/photo-service/photo.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Photo } from 'src/app/shared/models/photo.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photo-grid',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    PhotoCardComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './photo-grid.component.html',
  styleUrls: ['./photo-grid.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PhotoGridComponent implements OnInit {
  isLoading = signal(false);
  photos = this.photoService.photos$;
  favorites = this.photoService.favorites$;

  constructor(private photoService: PhotoService, private router: Router) {
    this.photoService.loadPhotos(); // Load photos when the component initializes
    this.photoService.loadFavoritesFromStorage(); // Load favorites from storage
  }

  ngOnInit(): void {
    this.photoService.loadPhotos(20);
  }

  setPhoto(photo: Photo) {
    const isFavorite = this.favorites().some((fav) => fav.id === photo.id);
    return { photo, isFavorite };
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const nearBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 10;

    if (nearBottom) {
      this.isLoading.set(true);
      setTimeout(() => {
        this.photoService.loadPhotos(10); // Load more photos
        this.isLoading.set(false);
      }, Math.random() * 100 + 200); // Simulated delay
    }
  }

  openPhotoDetails(photo: Photo): void {
    this.photoService.addToFavorites(photo);
    this.router.navigate(['/photos', encodeURIComponent(photo.id)]);
  }
}
