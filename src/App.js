import React from 'react'
import { Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import AddToBookList from './AddToBookList'
import BookWrapper from './BookWrapper'
import './App.css'

class BooksApp extends React.Component {
  /**
   * TODO: Create controlled select box on Book component
   */
  
  state = {
    myBooks: [],
    currentlyReading: [],
    wantToRead: [],
    read: [],
  };

  updateShelf = (book,shelf) => {
    BooksAPI.get(book).then((bookObj) => {
      bookObj.shelf = shelf;
      const newMyBooks = this.state.myBooks.map((c) => {
        if(c.id === bookObj.id) {
          c.shelf = shelf;
        }
        return c;
      })

      


      BooksAPI.update(bookObj,shelf).then((bookStatus) => {
        this.updateState(shelf, bookObj, "currentlyReading");
        this.updateState(shelf, bookObj, "wantToRead");
        this.updateState(shelf, bookObj, "read");
      })


      this.setState({myBooks: newMyBooks});
    })
  }

  updateState(shelf,book,existingShelf){
    let readStatus = this.state[existingShelf];

    readStatus = readStatus.filter(a => a.id !== book.id);
    if (shelf === existingShelf) readStatus = readStatus.concat(book);
    
    const key = existingShelf;
    const readStatusObj = {};
    readStatusObj[key] = readStatus;

    this.setState(readStatusObj);
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {

      let myBooks = books;
      let currentlyReading = [];
      let wantToRead = [];
      let read = [];

      books.map((book) => {
        if(book.shelf === "currentlyReading") {
          currentlyReading.push(book);
        }
        if(book.shelf === "wantToRead") {
          wantToRead.push(book);
        }
        if(book.shelf === "read") {
          read.push(book);
        }
        return book;
      })

      this.setState({currentlyReading, wantToRead, read, myBooks});
    });
  }

  render() {

    return (
      <div className="app">
        <Route exact path="/" render={() => (
          <BookWrapper 
            currentlyReading={this.state.currentlyReading}
            wantToRead={this.state.wantToRead}
            read={this.state.read}
            updateShelf={this.updateShelf}
          />
        )}/>

        <Route exact path="/search" render={() => (
          <AddToBookList
            updateShelf={this.updateShelf}
            myBooks={this.state.myBooks}
          />
        )}/>
      </div>
    )
  }
}

export default BooksApp
