import { Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { CreateBookComponent } from './create-book/create-book.component';

export const routes: Routes = [
    { path: '', redirectTo: '/books', pathMatch: 'full' },
    {path:'books', component: BookListComponent},
    {path:'addBook', component: CreateBookComponent},
    // { path: '', redirectTo: '/addBook', pathMatch: 'full' },
    // { path: '**', redirectTo: '/books' }
];
