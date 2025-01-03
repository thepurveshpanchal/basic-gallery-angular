import { Injectable, signal } from '@angular/core';
import { Photo } from 'src/app/shared/models/photo.interface';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private readonly photos = signal<Photo[]>([]);
  private readonly favorites = signal<Photo[]>([]);

  constructor() {
    this.loadFavoritesFromStorage(); // Sync favorites from localStorage on service initialization
  }

  // Expose readonly signals
  get photos$() {
    return this.photos.asReadonly();
  }

  get favorites$() {
    return this.favorites.asReadonly();
  }

  // Load random photos
  loadPhotos(count: number = 10): void {
    const newPhotos = Array.from({ length: count }, () =>
      this.generateRandomPhoto()
    );
    this.photos.update((current) => [...current, ...newPhotos]);
  }

  // Add a photo to favorites if it doesn't already exist
  addToFavorites(photo: Photo): void {
    if (photo && !this.isFavorite(photo.id)) {
      this.favorites.update((current) => [...current, photo]);
      this.syncFavoritesToStorage();
    }
  }

  // Remove a photo from favorites by ID
  removeFromFavorites(photoId: string): void {
    if (!photoId) return;
    this.favorites.update((current) =>
      current.filter((photo) => photo.id !== photoId)
    );
    this.syncFavoritesToStorage();
  }

  // Check if a photo is already in favorites
  isFavorite(photoId: string): boolean {
    return this.favorites().some((fav) => fav.id === photoId);
  }

  // Retrieve a photo by ID from either photos or favorites
  getPhotoById(id: string): Photo | undefined {
    return (
      this.photos().find((photo) => photo.id === id) ||
      this.favorites().find((photo) => photo.id === id)
    );
  }

  // Load favorites from localStorage
  public loadFavoritesFromStorage(): void {
    try {
      const storedFavorites = JSON.parse(
        localStorage.getItem('favorites') || '[]'
      ) as Photo[];
      this.favorites.set(storedFavorites);
    } catch {
      console.error(
        'Error loading favorites from localStorage. Resetting favorites.'
      );
      this.favorites.set([]);
    }
  }

  // Sync favorites with localStorage
  private syncFavoritesToStorage(): void {
    try {
      localStorage.setItem('favorites', JSON.stringify(this.favorites()));
    } catch {
      console.error('Error syncing favorites to localStorage.');
    }
  }

  // Generate a random photo object
  private generateRandomPhoto(): Photo {
    const id = Math.random().toString(36).substring(7);
    return {
      id,
      url: `https://picsum.photos/200/300?random=${id}`,
    };
  }
}
