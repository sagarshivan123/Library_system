import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from "react-redux"

import {deleteBook} from "../store/slices/bookSlice"
import {toggleDeleteBookPopup} from "../store/slices/popupSlice"

const DeleteBookPopup = ({bookId}) => {
const dispatch=useDispatch();
const handleDeleteBook=()=>{
  dispatch(deleteBook(bookId));
  dispatch(toggleDeleteBookPopup());
}
return <>
 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this book?
        </p>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => dispatch(toggleDeleteBookPopup())}
            className="px-4 bg-gray-200 py-2 rounded hover:bg-gray-300"
          
          >
            Cancel
          </button>
          <button
              onClick={handleDeleteBook}
            className="px-4 text-white bg-gray-900 py-2 rounded hover:bg-gray-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
</>
}
export default DeleteBookPopup;