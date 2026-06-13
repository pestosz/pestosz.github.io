import express from "express";
import db from "../db/database.js";

const router = express.Router();

router.get("/", (req, res) => {
  const books = db.prepare("SELECT * FROM book").all();
  res.render("book/index", {
    title: "Book List",
    bodyClass: "index",
    books: books,
  });
});

router.get("/create", (req, res) => {
  res.render("book/create", {
    title: "Create Book",
    bodyClass: "edit",
    book: null,
  });
});

router.post("/create", (req, res) => {
  const { title, author, description } = req.body.book || {};

  const insert = db.prepare(
    "INSERT INTO book (title, author, description) VALUES (?, ?, ?)",
  );
  insert.run(title, author, description);

  res.redirect("/books");
});

router.get("/:id", (req, res) => {
  const book = db.prepare("SELECT * FROM book WHERE id = ?").get(req.params.id);
  if (!book) {
    return res.status(404).send("Missing book with id " + req.params.id);
  }
  res.render("book/show", {
    title: `${book.title} (${book.id})`,
    bodyClass: "show",
    book: book,
  });
});

router.get("/:id/edit", (req, res) => {
  const book = db.prepare("SELECT * FROM book WHERE id = ?").get(req.params.id);
  if (!book) {
    return res.status(404).send("Missing book with id " + req.params.id);
  }
  res.render("book/edit", {
    title: `Edit Book ${book.title} (${book.id})`,
    bodyClass: "edit",
    book: book,
  });
});

router.post("/:id/edit", (req, res) => {
  const { title, author, description } = req.body.book || {};
  const id = req.params.id;

  const update = db.prepare(
    "UPDATE book SET title = ?, author = ?, description = ? WHERE id = ?",
  );
  update.run(title, author, description, id);

  res.redirect("/books");
});

router.post("/:id/delete", (req, res) => {
  const id = req.params.id;
  const del = db.prepare("DELETE FROM book WHERE id = ?");
  del.run(id);

  res.redirect("/books");
});

export default router;
