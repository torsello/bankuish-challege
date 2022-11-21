# Bankuish Courses

**Bankuish** is a Fintech company that makes it easy for gig workers and freelancers to
access affordable credit.
An important part of enabling access to credit is helping individuals develop their
"Financial literacy" – the knowledge and skills they need to make important financial
decisions. Bankuish team has created a series of short training videos that help gig
workers learn quickly and easily and ultimately achieve financial literacy.

## Requirements

* Node 16
* Docker
* MySql

## Installation

To perform a correct installation, it is recommended to use  

```bash
docker-compose up
```
to start the system

## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/torsello/bankuish-challege.git
cd bankuish-challege

```

```bash
npm install
```

## Steps 

To start the express server, run the following

```bash
nodemon server.js
```

## Usage 

When server starts, it automatically loads the list of courses with their priorities and dependencies. 
All that remains is to create a user by calling the following curl
```bash
curl --location --request POST 'http://localhost:8080/api/user/1.0/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"jhon.snow@bar.com",
    "phone":"1111111111",
    "fullname":"Jhon Snow",
    "password": "invernalia"
}'
```
After this we already have our registered user.
All that remains is to call the curl with the available courses that the user has.

```bash
curl --location --request POST 'http://localhost:8080/api/scheduler/1.0' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userId": "b61d681f-ce3d-42b0-88ae-3a2f133cc4ed",
    "courses": [
        {
            "desiredCourse": "Finance",
            "requiredCourse": ""
        },
        {
            "desiredCourse": "PortfolioConstruction",
            "requiredCourse": "PortfolioTheories"
        },
        {
            "desiredCourse": "InvestmentManagement",
            "requiredCourse": "Investment"
        },
        {
            "desiredCourse": "Investment",
            "requiredCourse": "Finance"
        },
        {
            "desiredCourse": "PortfolioTheories",
            "requiredCourse": "Investment"
        },
        {
            "desiredCourse": "InvestmentStyle",
            "requiredCourse": "InvestmentManagement"
        }
    ]
}'
```


This will register your courses, and through the ordered curl, we will obtain the courses in order of priority, with an attribute 'is_available' that will refer us if the course can be taken, and with a lifecycle, which will change according to the state in which the course is. grade. Possible values ​​are 'assigned', 'ongoing', 'completed'

curl get courses ordered by lifecycle and priorities:
```bash
curl --location --request GET 'http://localhost:8080/api/scheduler/1.0/4dbbd716-edf9-4a20-b38d-4ffef52d00ad/ordered'
```

curl change lifecycle (assigned -> ongoing -> completed):
```bash
curl --location --request POST 'http://localhost:8080/api/scheduler/1.0/change-lifecycle' \
--header 'Content-Type: application/json' \
--data-raw '{
    "user":{
        "uuid":"4dbbd716-edf9-4a20-b38d-4ffef52d00ad"
    },
    "course":{
        "uuid":"0298a916-8508-4947-98e8-66abd1c2adb1"
    }
}'
```

## Postman collection:
```bash
https://www.getpostman.com/collections/96bc5674479a3a3a2e15
```