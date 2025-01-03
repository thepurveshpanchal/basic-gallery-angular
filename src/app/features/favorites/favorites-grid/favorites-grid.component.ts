import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { PhotoCardComponent } from 'src/app/shared/components/photo-card/photo-card.component';
import { PhotoService } from 'src/app/core/services/photo-service/photo.service';
import { Photo } from 'src/app/shared/models/photo.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites-grid',
  standalone: true,
  imports: [NgFor, PhotoCardComponent],
  templateUrl: './favorites-grid.component.html',
  styleUrls: ['./favorites-grid.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FavoritesGridComponent implements OnInit {
  favorites = this.photoService.favorites$;

  constructor(public photoService: PhotoService, private router: Router) {}

  ngOnInit(): void {
    this.photoService.loadFavoritesFromStorage();
  }

  cardPhotoClicked(photo: Photo): void {
    this.router.navigate(['/photos', encodeURIComponent(photo.id)]);
  }
}
