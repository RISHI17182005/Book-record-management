const express = require("express");

const { books } = require("../data/books.json");
const { users } = require("../data/users.json");

const router = express.Router();

/**
 * Route: /
 * Method: GET
 * Description: Get all books
 * Access: Public
 * Parameters: None
 */

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        data: books
    })
})

/**
 * Route: /:id
 * Method: GET
 * Description: Get book by id
 * Access: Public
 * Parameters: None
 */

router.get("/:id", (req, res) => {
    const { id } = req.params;
    const book = books.find((each) => each.id === id);
    if (book) {
        res.status(200).json({
            success: true,
            data: book
        })
    }
    else {
        res.status(404).json({
            success: false,
            message: "book doesn't exist"
        })
    }
})

/**
 * Route: /issued/book
 * Method: GET
 * Description: Get issude books
 * Access: Public
 * Parameters: None
 */

router.get("/issued/book", (req, res) => {
    const usersWithIssuedBook = users.filter((each) => {
        if (each.issuedBook) return each;
    });
    const issuedBooks = [];

    usersWithIssuedBook.forEach((each) => {
        const book = books.find((book) => book.id == each.issuedBook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    })

    if (issuedBooks.length === 0) {
        res.status(404).json({
            success: false,
            message: "book not issued"
        })
    }
    else {
        res.status(200).json({
            success: true,
            message: "users with issued books",
            data: issuedBooks
        })
    }
})

/**
 * Route: /
 * Method: POST
 * Description: Adding a New Book
 * Access: Public
 * Parameters: None
 * Data : id, name, author, genre, price, publisher
 */

router.post("/", (req, res) => {
    const {id} = req.params;
    const { data } = req.body;

    if (!data) {
        return res.status(400).json({
            success: false,
            message: "no data to add a book"
        })
    }

    const book = books.find((each) => each.id === data.id);
    if (book) {
        return res.status(404).json({
            success: false,
            message: "book already exists"
        })
    }
    const allBooks = { ...books, data };
    return res.status(201).json({
        success: true,
        message: "book added successfully",
        data: allBooks
    })
})

/**
 * Route: /:id
 * Method: PUT
 * Description: Updating a Book By Its ID
 * Access: Public
 * Parameters: Id
 * Data : id, name, genre, price, publisher, author
 */

router.put("/update/:id",(req,res) => {
    const {id} = req.params;
    const {data} = req.body;

    const book = books.find((each) => each.id === id);
    if(!book)
    {
        return res.status(404).json({
            success:false,
            message:"book doesn't exist"
        })
    }

    const updatedBookData = books.map((each) => {
        if(each.id === id)
        {
            return {
                ...each,
                ...data
            };
        }
        return each;
    })
    
    return res.status(200).json({
        success:true,
        message:"updated successfully",
        data:updatedBookData
    })
    
})

module.exports = router;