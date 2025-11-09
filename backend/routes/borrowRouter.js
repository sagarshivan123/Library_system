import express from 'express'
import {isAuthenticated,isAuthorized} from '../Middleware/authMiddleware.js'
import { borrowedBooks, getBorrowBooksForAdmin, recordBorrowedBook, returnBorrowedBook } from '../controllers/borrowController.js'

const router = express.Router();

router.post("/record-borrow-book/:id",isAuthenticated,isAuthorized("Admin"), recordBorrowedBook);

router.get("/borrowed-books-by-users", isAuthenticated, isAuthorized("Admin"),getBorrowBooksForAdmin);

router.get("/my-borrowed-books", isAuthenticated,borrowedBooks);

router.put("/return-borrowed-book/:bookId", isAuthenticated,isAuthorized("Admin"), returnBorrowedBook);

export default router;