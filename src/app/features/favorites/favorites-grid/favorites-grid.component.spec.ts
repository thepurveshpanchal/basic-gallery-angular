import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { FavoritesGridComponent } from './favorites-grid.component';
import { PhotoService } from 'src/app/core/services/photo-service/photo.service';

describe('FavoritesGridComponent', () => {
  let component: FavoritesGridComponent;
  let fixture: ComponentFixture<FavoritesGridComponent>;
  let mockPhotoService: jasmine.SpyObj<PhotoService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const favoritesSignal = signal([
      { id: '1', url: 'https://example.com/photo1.jpg' },
    ]);

    // Create a mock PhotoService with the Signal
    mockPhotoService = jasmine.createSpyObj<PhotoService>(
      'PhotoService',
      ['loadFavoritesFromStorage'],
      { favorites$: favoritesSignal }
    );

    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FavoritesGridComponent], // Use imports for standalone components
      providers: [
        { provide: PhotoService, useValue: mockPhotoService },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // To ignore unknown custom elements
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call `loadFavoritesFromStorage` on initialization', () => {
    expect(mockPhotoService.loadFavoritesFromStorage).toHaveBeenCalled();
  });

  it('should display favorite photos', () => {
    const compiled = fixture.nativeElement;
    const photoCards = compiled.querySelectorAll('app-photo-card');
    expect(photoCards.length).toBe(1); // Ensure the photo renders correctly
  });

  it('should navigate to the photo details page when a photo is clicked', () => {
    const mockPhoto = { id: '1', url: 'https://example.com/photo1.jpg' };
    component.cardPhotoClicked(mockPhoto);

    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/photos',
      encodeURIComponent(mockPhoto.id),
    ]);
  });
});
