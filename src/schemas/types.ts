interface Node {
	id: Binary!
}

type Account implements Node {
	id: Binary!
	firstname: String!
	lastname: Sting!
	emailAddress: EmailAddress!
	createdAt: DateTime!
	updatedAt: DateTime!
}

type Product implements Node {
	id: Binary!
	name: String!
	description: String!
	owner: Account!
	createdAt: DateTime!
	updatedAt: DateTime!
}

type Authentication {
	token: String!
}