const express = require('express')
const jwt = require('jsonwebtoken')
let books = require('./booksdb.js')
const regd_users = express.Router()
const session = require('express-session')

let users = []

const isValid = username => {
	const userMatches = users.filter(user => user.username === username)
	return userMatches.length > 0
}

const authenticatedUser = (username, password) => {
	const matchingUsers = users.filter(
		user => user.username === username && user.password === password
	)
	return matchingUsers.length > 0
}
// Add login Task 7
regd_users.use(
	session({secret: 'fingerpint'}, (resave = true), (saveUninitialized = true))
)

//Add login Task 7
regd_users.post('/login', (req, res) => {
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

// Add book review Task 8
regd_users.put('/auth/review/:isbn', (req, res) => {
	const isbn = req.params.isbn
	const review = req.body.review
	const username = req.session.authorization.username
	if (books[isbn]) {
		let book = books[isbn]
		book.reviews[username] = review
		return res.status(200).send('Posted successfully!')
	} else {
		return res.status(404).json({message: `Can not find ISBN: ${isbn}`})
	}
})
// Add delete book review Task 9
regd_users.delete('/auth/review/:isbn', (req, res) => {
	const isbn = req.params.isbn
	const username = req.session.authorization.username
	if (books[isbn]) {
		let book = books[isbn]
		delete book.reviews[username]
		return res.status(200).send('Deleted Successfully!')
	} else {
		return res.status(404).json({message: `Can not find ISBN: ${isbn}`})
	}
})

module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users