import sqlite3
from flask import Flask, render_template, request, redirect, url_for, abort

app = Flask(__name__)
ALBUM_NUMBER = 57885

def get_db_connection():
    connection = sqlite3.connect('database.db')
    connection.row_factory = sqlite3.Row
    return connection

@app.route('/')
def index():
    return redirect(url_for('book_index'))

@app.route('/books')
def book_index():
    conn = get_db_connection()
    books = conn.execute('SELECT * FROM book').fetchall()
    conn.close()
    return render_template('index.html', books=books)

@app.route('/books/<int:book_id>')
def book_show(book_id):
    conn = get_db_connection()
    book = conn.execute('SELECT * FROM book WHERE id = ?', (book_id,)).fetchone()
    conn.close()
    if book is None:
        abort(404)
    return render_template('show.html', book=book)


@app.route('/books/create', methods=('GET', 'POST'))
def book_create():
    if request.method == 'POST':
        title = request.form['title']
        author = request.form['author']
        description = request.form['description']

        conn = get_db_connection()
        conn.execute('INSERT INTO book (title, author, description) VALUES (?, ?, ?)',
                     (title, author, description))
        conn.commit()
        conn.close()
        return redirect(url_for('book_index'))
    return render_template('create.html')


@app.route('/books/<int:book_id>/edit', methods=('GET', 'POST'))
def book_edit(book_id):
    conn = get_db_connection()
    book = conn.execute('SELECT * FROM book WHERE id = ?', (book_id,)).fetchone()

    if book is None:
        conn.close()
        abort(404)

    if request.method == 'POST':
        title = request.form['title']
        author = request.form['author']
        description = request.form['description']

        conn.execute('UPDATE book SET title = ?, author = ?, description = ? WHERE id = ?',
                     (title, author, description, book_id))
        conn.commit()
        conn.close()
        return redirect(url_for('book_index'))

    conn.close()
    return render_template('edit.html', book=book)

@app.route('/books/<int:book_id>/delete', methods=('POST',))
def book_delete(book_id):
    conn = get_db_connection()
    book = conn.execute('SELECT * FROM book WHERE id = ?', (book_id,)).fetchone()

    if book is None:
        conn.close()
        abort(404)

    conn.execute('DELETE FROM book WHERE id = ?', (book_id,))
    conn.commit()
    conn.close()
    return redirect(url_for('book_index'))

if __name__ == '__main__':
    app.run(port=ALBUM_NUMBER, debug=True)