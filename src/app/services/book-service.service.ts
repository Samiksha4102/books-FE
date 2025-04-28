import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../book';

@Injectable({
  providedIn: 'root'
})
export class BookServiceService {
  baseUrl = 'http://localhost:8081/books';
  private httpClient = inject(HttpClient);

  constructor() { }

  addBook(book: Book): Observable<Object>{
    console.log("Book to be added: ", book);
    return this.httpClient.post(`${this.baseUrl}`, book);
  }
}
