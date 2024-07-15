# COMP3900 Project - AtkinsFans
Our app creates a website called 'Meme Analytics' that displays visuals on how memes perform. See our full report for definitions and more information.

Follow the following instructions to run:
## For users
While in `capstone-project-3900w11aatkinsfans`, ensure you have Docker Desktop installed and running.
In the console, run:

> docker-compose up

The website can be accessed on the url:

http://localhost:3333

## For devs
### Using docker
While in `capstone-project-3900w11aatkinsfans`, ensure you have Docker Desktop installed and running.
In the console, run:

> docker-compose up

After any updates to the code, stop the docker container, and rebuild the container using:

> docker-compose up --build

This can take a couple minutes each time and generates a new 2GB image every time. Consider running the code manually as shown below.

### Front End
While in `capstone-project-3900w11aatkinsfans/frontend`  
Install dependencies:

> npm install

Run the front end app:

> npm start

### Back End
While in `capstone-project-3900w11aatkinsfans/backend`  
Install dependencies:

> pip install -r requirements.txt  

Run the back end:

> python app.py

[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=15170785&assignment_repo_type=AssignmentRepo)