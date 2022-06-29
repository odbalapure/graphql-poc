# GraphQL basic
This is a demo GraphQL + Express project

## Get books and map author
query {
	books {
    name
    authors {
      name
    }
  }
}

## Get authors and map books
query {
	authors {
    id
    name
    books {
      name
    }
  }
}

## Get a single book
query {
  book (id: 7) {
    name
  }
}

## Add an author
mutation {
	addAuthor (name: "Harish Balapure") {
    name
  }
}