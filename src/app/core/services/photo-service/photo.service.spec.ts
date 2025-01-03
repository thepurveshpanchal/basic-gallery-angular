import { TestBed } from '@angular/core/testing';
import { PhotoService } from './photo.service';
import { Photo } from 'src/app/shared/models/photo.interface';

describe('PhotoService', () => {
  let service: PhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoService);

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'favorites') return JSON.stringify([]);
      return null;
    });

    spyOn(localStorage, 'setItem').and.stub();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadPhotos', () => {
    it('should add random photos to the photo list', () => {
      service.loadPhotos(5);
      expect(service.photos$().length).toBe(5);
    });

    it('should append new random photos to the existing photo list', () => {
      service.loadPhotos(3);
      const initialLength = service.photos$().length;
      service.loadPhotos(2);
      expect(service.photos$().length).toBe(initialLength + 2);
    });
  });

  describe('addToFavorites', () => {
    it('should add a photo to favorites', () => {
      const photo: Photo = { id: '1', url: 'https://example.com/photo1.jpg' };
      service.addToFavorites(photo);
      expect(service.favorites$().length).toBe(1);
      expect(service.isFavorite('1')).toBeTrue();
    });

    it('should not add duplicate photos to favorites', () => {
      const photo: Photo = { id: '1', url: 'https://example.com/photo1.jpg' };
      service.addToFavorites(photo);
      service.addToFavorites(photo);
      expect(service.favorites$().length).toBe(1);
    });

    it('should sync favorites to localStorage', () => {
      const photo: Photo = { id: '1', url: 'https://example.com/photo1.jpg' };
      service.addToFavorites(photo);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'favorites',
        JSON.stringify([photo])
      );
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove a photo from favorites by ID', () => {
      const photo: Photo = { id: '1', url: 'https://example.com/photo1.jpg' };
      service.addToFavorites(photo);
      service.removeFromFavorites('1');
      expect(service.favorites$().length).toBe(0);
      expect(service.isFavorite('1')).toBeFalse();
    });

    it('should not throw an error when removing a non-existent photo', () => {
      expect(() => service.removeFromFavorites('non-existent')).not.toThrow();
    });

    it('should sync changes to localStorage after removing a photo', () => {
      const photo: Photo = { id: '1', url: 'https://example.com/photo1.jpg' };
      service.addToFavorites(photo);
      service.removeFromFavorites('1');
      expect(localStorage.setItem).toHaveBeenCalledWith('favorites', '[]');
    });
  });

  describe('isFavorite', () => {
    it('should return true if a photo is in favorites', () => {
      const photo: Photo = { id: '1', url: 'https://example.com/photo1.jpg' };
      service.addToFavorites(photo);
      expect(service.isFavorite('1')).toBeTrue();
    });

    it('should return false if a photo is not in favorites', () => {
      expect(service.isFavorite('non-existent')).toBeFalse();
    });
  });

  describe('getPhotoById', () => {
    it('should retrieve a photo by ID from the photo list', () => {
      const photo: Photo = { id: '1', url: 'https://example.com/photo1.jpg' };

      // Manually load a specific photo into the photos signal
      service.loadPhotos(); // Use the service's public method to populate photos
      service['photos'].set([photo]); // Directly set state for testing purposes

      const result = service.getPhotoById('1');
      expect(result).toEqual(photo);
    });

    it('should retrieve a photo by ID from the favorites list', () => {
      const photo: Photo = { id: '1', url: 'https://example.com/photo1.jpg' };
      service.addToFavorites(photo);

      const result = service.getPhotoById('1');
      expect(result).toEqual(photo);
    });

    it('should return undefined if the photo does not exist', () => {
      expect(service.getPhotoById('non-existent')).toBeUndefined();
    });
  });

  describe('loadFavoritesFromStorage', () => {
    it('should load favorites from localStorage', () => {
      const storedFavorites: Photo[] = [
        { id: '1', url: 'https://example.com/photo1.jpg' },
      ];
      (localStorage.getItem as jasmine.Spy).and.returnValue(
        JSON.stringify(storedFavorites)
      );

      service.loadFavoritesFromStorage();
      expect(service.favorites$()).toEqual(storedFavorites);
    });

    it('should handle invalid JSON in localStorage gracefully', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('INVALID_JSON');
      spyOn(console, 'error');
      service.loadFavoritesFromStorage();
      expect(service.favorites$()).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('syncFavoritesToStorage', () => {
    it('should save favorites to localStorage', () => {
      const photo: Photo = { id: '1', url: 'https://example.com/photo1.jpg' };
      service.addToFavorites(photo);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'favorites',
        JSON.stringify([photo])
      );
    });

    it('should handle localStorage errors gracefully', () => {
      spyOn(console, 'error');
      (localStorage.setItem as jasmine.Spy).and.throwError(
        'localStorage error'
      );

      const photo: Photo = { id: '1', url: 'https://example.com/photo1.jpg' };
      service.addToFavorites(photo);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
