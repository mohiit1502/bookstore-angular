import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../services/login.service";
import {Book} from "../../models/book";
import {GetBookListService} from "../../services/get-book-list.service";
import {RemoveBookService} from "../../services/remove-book.service";
import {Router} from "@angular/router";

import {MdDialog, MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  private selectedBook : Book;
  private checked:boolean;
  private bookList: Book[];
  private allChecked:boolean;
  private removeBookList: Book[]=new Array();

  constructor(private removeBookService:RemoveBookService, private getBookListService: GetBookListService, private router: Router, public dialog: MdDialog) {
    this.getBookListService.getBookList().subscribe(
      res => {
        console.log(res.json());
        this.bookList=res.json();
      },
      err => {
        console.log(err);
      }
      );
  }

  onSelect(book:Book) {
    this.selectedBook = book;
    this.router.navigate(['/viewBook', this.selectedBook.id]);
  }

  openDialog(book:Book) {
    let dialogRef = this.dialog.open(DialogResultExampleDialog);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result=="yes") {
        this.removeBookService.sendBook(book.id).subscribe(
          res => {
            console.log(res);
            location.reload();
          },
          err => {
            console.log(err);
          }

          );
      }
    });
  }

  updateRemoveBookList(checked:boolean, book:Book) {
    if(checked){
      this.removeBookList.push(book);
    } else {
      this.removeBookList.splice(this.removeBookList.indexOf(book),1);
    }
    console.log(this.removeBookList);
  }

  updateSelected(checked:boolean){
    if(checked) {
      this.allChecked=true;
      this.removeBookList=this.bookList;
    } else {
      this.allChecked=false;
      this.removeBookList=[];
    }
  }

  removeSelectedBooks() {
    let dialogRef = this.dialog.open(DialogResultExampleDialog);
    dialogRef.afterClosed().subscribe(result => {
      if(result=="yes") {
        for (let book of this.removeBookList) {
          this.removeBookService.sendBook(book.id).subscribe(
            res => {
            },
            err => {
            }

            );
        };
        location.reload();
      }
    });
  }

  ngOnInit() {

  }
}


@Component({
  selector: 'dialog-result-example-dialog',
  templateUrl: './dialog-result-example-dialog.html'
})
export class DialogResultExampleDialog {
  constructor(public dialogRef: MdDialogRef<DialogResultExampleDialog>) {}
}
