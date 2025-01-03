import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/photos/photo-grid/photo-grid.component').then(
        (m) => m.PhotoGridComponent
      ),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import(
        './features/favorites/favorites-grid/favorites-grid.component'
      ).then((m) => m.FavoritesGridComponent),
  },
  {
    path: 'photos/:id',
    loadComponent: () =>
      import('./features/photos/single-photo/single-photo.component').then(
        (m) => m.SinglePhotoComponent
      ),
  },
];
