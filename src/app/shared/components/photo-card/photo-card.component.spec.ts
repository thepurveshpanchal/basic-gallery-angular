import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoCardComponent } from './photo-card.component';
import { Photo } from '../../models/photo.interface';
import { CommonModule } from '@angular/common';

// Mock data for a valid photo
const mockPhoto: Photo = {
  id: '1',
  url: 'https://example.com/photo.jpg',
};

describe('PhotoCardComponent', () => {
  let component: PhotoCardComponent;
  let fixture: ComponentFixture<PhotoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [CommonModule, PhotoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCardComponent);
    component = fixture.componentInstance;
  });

  // Test 1: Component should be created
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
