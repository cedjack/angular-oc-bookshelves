import {Injectable} from '@angular/core';
import {Book} from '../models/book.model';
import {Subject} from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  books: Book[] = [];
  booksSubject = new Subject<Book[]>();

  constructor() {
  }

  emitBooks() {
    this.booksSubject.next(this.books);
  }

  saveBooks() {
    firebase.database().ref('/books').set(this.books);
  }

  // '.on()' permet de renvoyer les données à chaque fois qu'une valeur est modifiée par un autre utilisateur par exemple
  getBooks() {
    firebase.database().ref('/books').on('value', (data) => {
      this.books = data.val() ? data.val() : [];
      this.emitBooks();
    });
  }

  getSingleBook(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewBook(newBook: Book) {
    this.books.push(newBook);
    this.saveBooks();
    this.emitBooks();
  }

  removeBook(book: Book) {
    if (book.photo) {
      const storageBase = firebase.storage().refFromURL(book.photo);
      storageBase.delete().then(
        () => {
          console.log('photo supprimée !');
        }
      ).catch(
        (error) => {
          console.log('fichier non trouvé !');
        }
      );

    }
    const bookIndexToRemove = this.books.findIndex(
      (boolElement) => {
        if (boolElement === book) {
          return true;
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1);
    this.saveBooks();
    this.emitBooks();
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('debut chargement fichier ...');
          },
          (error) => {
            console.log('erreur lors du chargement fichier: ' + error);
            reject();
          },
          () => {
            console.log('chargement fichier terminé !');
            // il s'agit de l'url directe de l'image
            resolve(upload.snapshot.ref.getDownloadURL());
          }
        );
      }
    );
  }
}
