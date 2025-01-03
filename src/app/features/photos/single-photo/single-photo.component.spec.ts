import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SinglePhotoComponent } from './single-photo.component';
import { PhotoService } from 'src/app/core/services/photo-service/photo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Photo } from 'src/app/shared/models/photo.interface';

describe('SinglePhotoComponent', () => {
  let component: SinglePhotoComponent;
  let fixture: ComponentFixture<SinglePhotoComponent>;
  let mockPhotoService: jasmine.SpyObj<PhotoService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  const mockPhoto: Photo = { id: '1', url: 'http://example.com/photo.jpg' };

  beforeEach(async () => {
    mockPhotoService = jasmine.createSpyObj('PhotoService', [
      'getPhotoById',
      'removeFromFavorites',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { paramMap: { get: () => '1' } },
    });

    mockPhotoService.getPhotoById.and.returnValue(mockPhoto);

    await TestBed.configureTestingModule({
      imports: [SinglePhotoComponent],
      providers: [
        { provide: PhotoService, useValue: mockPhotoService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SinglePhotoComponent);
    component = fixture.componentInstance;
  });

  it('should retrieve photo on ngOnInit', () => {
    component.ngOnInit();

    expect(component.photo).toEqual(mockPhoto);
    expect(mockPhotoService.getPhotoById).toHaveBeenCalledWith('1');
  });

  it('should remove photo from favorites and navigate when removeFromFavorites is called', () => {
    component.photo = mockPhoto;

    component.removeFromFavorites();

    expect(mockPhotoService.removeFromFavorites).toHaveBeenCalledWith('1');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not call removeFromFavorites or navigate if photo is undefined', () => {
    component.photo = undefined;

    component.removeFromFavorites();

    expect(mockPhotoService.removeFromFavorites).not.toHaveBeenCalled();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
