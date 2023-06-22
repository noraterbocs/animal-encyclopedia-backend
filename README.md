# AnimalQuest project
This backend repository created by Nora Terbocs and Jennifer Feenstra-Arengard is used for storing user data and information about animals in MongoDB Atlas. It provides the necessary APIs and functionalities to support the frontend features related to user registration, login, and data retrieval for our Animal Quest application.

# Tech Stack
The backend is built using the following technologies:
MongoDB Atlas, Node.js, Express.js and is deployed through Google Cloud Platform. The folder structure has been created by using Express Router.

## Schemas and Endpoints 
### User schema: 
GET request:
- /users/user
- /users/users

POST request:
 - /users/login
 - /users/register
 - /users/user

 PATCH request:
 - /users/user

DELETE request:
- /users/user
### Game schema:
GET request:
- /games/completion
- /games/completion/lastgeneratedstory

POST request:
- /completions
### Animal schema:
GET request:
- /animals/animals/:animalId

## Testing and contribution
Contributions to the backend repository are welcome. If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.
To test first install dependencies with `npm install`, then start the server by running `npm run dev`.
## View it live

Deployed backend on Google Cloud:https://animal-encyclopedia-backend-7v5hitnola-no.a.run.app
Deployed frontend on Netlify: https://animalquest.netlify.app/login
Frontend repository: https://github.com/noraterbocs/animal-encyclopedia-final-project

