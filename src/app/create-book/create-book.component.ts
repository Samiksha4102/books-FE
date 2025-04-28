import { Component } from '@angular/core';
import { Book } from '../book';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookServiceService } from '../services/book-service.service';

@Component({
  selector: 'app-create-book',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})

export class CreateBookComponent {
  book: Book = new Book();

  constructor(private BookService: BookServiceService) { }
  ngOnInit(): void {
    this.book = new Book();
  }

  addBookData() {
    this.BookService.addBook(this.book).subscribe(data => {
      console.log(data);
      alert("Book added successfully!");
    }, error => {
      console.error(error);
      alert("Error adding book!");
    }
    );
  }
}
