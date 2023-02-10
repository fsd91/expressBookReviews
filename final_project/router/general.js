const express = require('express')
let books = require('./booksdb.js')
let isValid = require('./auth_users.js').isValid
let users = require('./auth_users.js').users
const public_users = express.Router()
const jwt = require('jsonwebtoken')
const session = require('express-session')
const axios = require('axios')

public_users.use(
	session({secret: 'fingerpint'}, (resave = true), (saveUninitialized = true))
)

// Add register Task 6
public_users.post('/register', (req, res) => {
	const username = req.body.username
	const password = req.body.password

	if (username && password) {
		if (!isValid(username)) {
			users.push({username: username, password: password})
			return res.status(200).json({
				message: 'User successfully registered. Now you can login',
			})
		} else {
			return res.status(404).json({message: 'User already exists!'})
		}
	}
	return res.status(404).json({message: 'Unable to register user.'})
})

// Get book list Task 1
public_users.get('/', async function (req, res) {
	const data = await getAllBooks()
	res.json(data)
})


// Get book based on ISBN Task 2
public_users.get('/isbn/:isbn', async (req, res) => {
	const isbn = req.params.isbn
	const data = await getBooksDetailsByISBN(isbn)
	res.send(books[data])
})

// Get book details based on the author Task 3
public_users.get('/author/:author', async (req, res) => {
	const author = req.params.author
	const data = await findAuthor(author)
	res.send(data)
})

// Get book title by title Task 4
public_users.get('/title/:title', async (req, res) => {
	const title = req.params.title
	const data = await findTitle(title)
	res.send(data)
})

//  Get book review by ISBN Task 5
public_users.get('/review/:isbn', function (req, res) {
	const reviewISBN = req.params.isbn

	Object.entries(books).map(book => {
		if (book[0] === reviewISBN) {
			res.send(book[1].reviews)
		}
	})
})

// Task 7
const authenticatedUser = (username, password) => {
	//returns boolean
	const matchingUsers = users.filter(
		user => user.username === username && user.password === password
	)
	return matchingUsers.length > 0
}

// Task 7
public_users.post('/login', (req, res) => {
	const username = req.body.username
	const password = req.body.password

	if (!username || !password) {
		return res.status(404).json({message: 'Error logging in'})
	}

	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign(
			{
				data: password,
			},
			'access',
			{expiresIn: 60 * 60}
		)

		req.session.authorization = {
			accessToken,
			username,
		}
		return res.status(200).send('User successfully logged in')
	} else {
		return res
			.status(208)
			.json({message: 'Invalid Login. Check username and password'})
	}
})

// Task 8
public_users.put('/auth/review/:isbn', (req, res) => {
	const isbn = req.params.isbn
	const review = req.body.review
	const username = req.session.authorization.username
	if (books[isbn]) {
		let book = books[isbn]
		book.reviews[username] = review
		return res.status(200).send('Review successfully posted')
	} else {
		return res.status(404).json({message: `ISBN ${isbn} not found`})
	}
})

// Task 9 
public_users.delete('/auth/review/:isbn', (req, res) => {
	const isbn = req.params.isbn
	const username = req.session.authorization.username
	if (books[isbn]) {
		let book = books[isbn]
		delete book.reviews[username]
		return res.status(200).send('Review successfully deleted')
	} else {
		return res.status(404).json({message: `ISBN ${isbn} not found`})
	}
})

module.exports.general = public_users

//Task 10
const getbooklist = async () => {
	try {
		const Promise10 = await Promise.resolve(books)
		if (Promise10) {
			return Promise10
		} else {
			return Promise.reject(new Error('Can not find'))
		}
	} catch (err) {
		console.log(err)
	}
}

// Task 11
const getbookisbn = async isbn => {
	try {
		const Promise11 = await Promise.resolve(isbn)
		if (Promise11) {
			return Promise.resolve(isbn)
		} else {
			return Promise.reject(new Error('Can not find'))
		}
	} catch (error) {
		console.log(error)
	}
}

// Task 12
const getbookauthor = async author => {
	try {
        const Promise12 = await Promise.resolve(author)
        if (Promise12) {
            return Promise.resolve(author)
        } else {
            return Promise.reject(new Error('Can not find'))
        }
    } catch (error) {
        console.log(error)
    }
}

// Task 13
const getbooktitle = async title => {
    try {
        const Promise13 = await Promise.resolve(title)
        if (Promise13) {
            return Promise.resolve(title)
        } else {
            return Promise.reject(new Error('Can not find'))
        }
    } catch (error) {
        console.log(error)
    }
}

