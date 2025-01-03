import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Photo } from '../../models/photo.interface';

@Component({
  selector: 'app-photo-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.scss'],
})
export class PhotoCardComponent {
  // Signal for photo input, initially undefined
  photo = input.required<Photo>();

  constructor() {}
}
