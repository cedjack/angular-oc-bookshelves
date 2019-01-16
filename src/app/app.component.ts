import {Component} from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
    // Initialize Firebase
    const config = {
      apiKey: 'AIzaSyArO5BIkLFwdMAc2bv0t7QpSOcB6wb1vkI',
      authDomain: 'angular-oc-bookshelves.firebaseapp.com',
      databaseURL: 'https://angular-oc-bookshelves.firebaseio.com',
      projectId: 'angular-oc-bookshelves',
      storageBucket: 'angular-oc-bookshelves.appspot.com',
      messagingSenderId: '1047385225021'
    };
    firebase.initializeApp(config);
  }
}
