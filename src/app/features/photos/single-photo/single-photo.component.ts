import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from 'src/app/core/services/photo-service/photo.service';
import { Photo } from 'src/app/shared/models/photo.interface';

@Component({
  selector: 'app-single-photo',
  standalone: true,
  templateUrl: './single-photo.component.html',
  styleUrls: ['./single-photo.component.scss'],
})
export class SinglePhotoComponent implements OnInit {
  photo?: Photo;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private photoService: PhotoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.photo = this.photoService.getPhotoById(id);
  }

  removeFromFavorites(): void {
    if (!!this.photo) {
      this.photoService.removeFromFavorites(this.photo.id);
      this.router.navigate(['/']);
    }
  }
}
