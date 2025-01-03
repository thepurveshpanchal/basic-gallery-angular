import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { PhotoGridComponent } from './photo-grid.component';
import { PhotoService } from 'src/app/core/services/photo-service/photo.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PhotoCardComponent } from 'src/app/shared/components/photo-card/photo-card.component';
import { signal } from '@angular/core';

describe('PhotoGridComponent', () => {
  let component: PhotoGridComponent;
  let fixture: ComponentFixture<PhotoGridComponent>;
  let mockPhotoService: jasmine.SpyObj<PhotoService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockPhotoService = jasmine.createSpyObj('PhotoService', [
      'loadPhotos',
      'loadFavoritesFromStorage',
      'addToFavorites',
    ]);

    // Mock the signals for photos$ and favorites$
    const mockPhotosSignal = signal([{ id: '1', title: 'Mock Photo' }]);
    const mockFavoritesSignal = signal([{ id: '1', title: 'Mock Photo' }]);

    // Mock the getter for read-only properties
    Object.defineProperty(mockPhotoService, 'photos$', {
      get: () => mockPhotosSignal,
    });
    Object.defineProperty(mockPhotoService, 'favorites$', {
      get: () => mockFavoritesSignal,
    });

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        PhotoGridComponent,
        PhotoCardComponent,
        MatProgressSpinnerModule,
      ],
      providers: [
        { provide: PhotoService, useValue: mockPhotoService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoGridComponent);
    component = fixture.componentInstance;
  });

  it('should call loadPhotos when onScroll is triggered near the bottom', fakeAsync(() => {
    const event = {
      target: {
        scrollHeight: 1000,
        scrollTop: 990,
        clientHeight: 20,
      },
    } as unknown as Event;

    component.onScroll(event);

    expect(mockPhotoService.loadPhotos).toHaveBeenCalledWith();
  }));

  it('should set isLoading to true and false when onScroll is triggered', fakeAsync(() => {
    const event = {
      target: {
        scrollHeight: 1000,
        scrollTop: 990,
        clientHeight: 20,
      },
    } as unknown as Event;

    expect(component.isLoading()).toBeFalse();

    component.onScroll(event);

    expect(component.isLoading()).toBeTrue();

    tick(250);

    expect(component.isLoading()).toBeFalse();
  }));

  it('should return photo with isFavorite status from setPhoto()', () => {
    const mockPhoto = { id: '1', title: 'Mock Photo' } as any;
    const result = component.setPhoto(mockPhoto);
    expect(result.photo).toEqual(mockPhoto);
    expect(result.isFavorite).toBeTrue(); // Ensure that the isFavorite is correctly set
  });
});
