# The Cocktail Library (server)

This is the server side for The Cocktail Library application. Users can create, search for any
collection, update, and delete cocktail collections. Built with node.js, express, mongoDB and mongoose.
This server interacts with this single page application [The Cocktail Library]( https://tslilpress.github.io/cocktail-library-client/). It's created as my second project for General Assembly.

## Important LInks
[Client side app repo on git hub](https://github.com/tslilpress/cocktail-library-client)----
[Client side app deployed site](https://tslilpress.github.io/cocktail-library-client/)

## Planning Story
I started by creating my Cocktail Schema as well as a separate Ingredient Schema that I later
decided not to use (I might use it in V2). Then created the cURL scripts for the different requests
and then the CRUD routes for the Cocktail.
The process was pretty simple since I had plenty of practice and examples that the school provided.

### User Stories
```md
- As a user I would like to be able to sign-up
- As a user I would like to be able to sign-in
- As a user I would like to be able to change my password
- As a user I would like to be able to sign-out
- As a user I would like to be able to add a new cocktail recipe
- As a user I would like to be able to look up an existing recipe
- As a user I would like to be able to look up all the recipes
- As a user I would like to be able to edit a recipe of my choice
- As a user I would like to be able to make comments inside my recipe
```

### Technologies Used
```md
- node.js
- Express
- MongoDB
- Mongoose
```

### Unsolved Problems
I would like to eventually make it possible for a user to search by any key in the cocktail
object, for example by name of cocktail, ingredients or even by the garnish.
I would also like to eventually use the ingredient schema so it could be updated separately
than the main document.

### ERD 
![Cocktail app ERD](https://user-images.githubusercontent.com/68870466/94321729-74372080-ff5e-11ea-8dc9-eda549a33524.jpg)
