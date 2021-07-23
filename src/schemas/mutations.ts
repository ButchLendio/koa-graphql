type Mutation {
	"""
	Sign up a user and get an access token if successful.

	## Error Codes
		* `BAD_USER_INPUT` - Email address already used.
	"""
	signUp(input: SignUpInput!): Authentication!


	"""
	Authenticate a user to get an access token if credentials are valid.

	## Error Codes
		* `BAD_USER_INPUT` - Invalid credentials.
	"""
	authenticate(input: AuthenticateInput!): Authentication!


	"""
	Create a product.
	"""
	createProduct(input: CreateProductInput!): Product! @private


	"""
	Update a product. User can only update own product.
	
	## Error Codes
		* `BAD_USER_INPUT` - Product not found.
		* `BAD_USER_INPUT` - Cannot update product.
	"""
	updateProduct(input: UpdateProductInput!): Product! @private


	"""
	Delete a product. User can only delete own product.

	## Error Codes
			* `BAD_USER_INPUT` - Product not found.
			* `BAD_USER_INPUT` - Cannot delete product.
	"""
	deleteProduct(input: DeleteProductInput!): Boolean! @private
}

input SignUpInput {
	emailAddress: EmailAddress!
	firstname: String!
	lastname: String!
	password: String!
}

input AuthenticateInput {
	emailAddress: String!
	password: String!
}

input CreateProductInput {
	name: String!
	description: String!
}

input UpdateProductInput {
	id: Binary!
	body: UpdateProductBody!
}

input UpdateProductBody {
	firstname: String
	lastname: String
}

input DeleteProductInput {
	id: Binary!
}