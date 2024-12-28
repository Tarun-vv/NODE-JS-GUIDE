NOTE: INITIAL PROJECT SETUP

NOTE: go to the app-v1 file for this process

1. set up prettier config
2. set up eslint.json -> get npm install command from notes and the 'eslintrc.json' from notes as well
3. make a package.json file with 'npm init' command
4. install express, npm i express@4 => used in tutorial
5. create app.js file

NOTE: SETTING UP APP.JS FILE

1. after initial app and server setup
2. start defining routes
3. to RUN the app initially use
   nodemon app.js (WILL SETUP commands later)
4. to check routes use POSTMAN for this URL: 127.0.0.1:3000
5. refer to requests saved in test folder

NOTE: sending different requests

1. read the data from the dev-data file and send it as a response using fs method
2. send different requests -> to send data in req.body use this middleware: app.use(express.json())
3. to set something as a body for post request , go to postman -> BODY -> raw and type in the object in JSON format
4. responding to URL params

NOTE: REFACTORING ROUTES - IMPORTANT

1. make each of the callback functions in the route handlers into seperate callback functions
2. do for all functions

NOTE: adding custom middleware

1. add morgon: npm i morgan

---

NOTE: AFTER SPLITTING INTO FUNCTIONS MOVE TO app.js file

NOTE: MOUNTING AND ROUTING - FINAL VERSION OF ROUTE

1. make the routers file
2. make the controllers file
3. take the tourRouter definition and put them in the tourRouter.js file
4. take out server part from the app.js

NOTE: param middleware => go to tourRoutes.js file

NOTE: serving static HTML file -> go to app.js

NOTE: environment variables

1. in the package.json set
   "start": "nodemon server.js" AND
   "start:prod": "NODE_ENV=production nodemon server.js"
2. in terminal run this command
   NODE_ENV='development' nodemon server.js
3. when doing console.log(process.env) -> you should see NODE_ENV='development' there
4. create config.env file, place this NODE_ENV='development' there
5. to actually use this file install
   npm i dotenv

6. go to server.js and require it and do all the stuff
7. go to app.js file and import the variables

NOTE: connecting node app with mongo db and mogoose

1. go to atlas
2. click on the projects on top left corner
3. click on the create new project button
4. fill in name -> next -> create
5. create a cluster
6. configure cluster ,-> choose free tier
7. give it proper name
8. close any fillups -> and wait till the cluster is created
9. click on the connect button
10. give username and the password
11. now save that password to the config.env file
12. click on create database user and then choose connection string -> click on compass -> choose "I have compass" option
13. copy the url that is present and open compass and click on plus icon -> and paste that url and switch the <db_password> with
    your password
14. ALSO ADD THAT STRING TO THE CONFIG FILE WITH A NAME CALLED
    DATABASE="mongodb+srv://tarun-test:<PASSWORD>@cluster0.5pfqx.mongodb.net/test-db?retryWrites=true"
    MAKE SURE TO CHNAGE ADD THE DATABASE NAME INSTEAD OF test-db
15. IN COMPASS: create on plus icon to create a new database
16. add in your db name and collection name and create

17. 🎉 SUCCESSFULLY CREATED MONGO SHELL WITH ATLAS

18. can look at data in CLUSTER by clicking on cluster -> collections
19. whitelisting our network -> network access -> add IP address -> allow access from anywhere -> conform

---------------------------------------

NOTE: CONNECTING MONGO SHELL to APP

1. install mongoose
   npm i mongoose@5

2. in server.js
3. if you rerun the server you should see 'DB connection successful'

NOTE: creating Modals using mongoose

1. create modals folder
2. follow the steps in tourModel.js
3. export and import it to tourController.js file

NOTE: creating documents out of Modals + CRUD functions
in tourController.js

NOTE: API FEATURES -> pagination , sorting, filtering
make the APIFeatures.js file and require in the controller file and add that features and await what you want in the next line

NOTE: ALAISING DONE IN tourRoutes.js and in controller

NOTE: AGGREGATION PIPELINE: calculating total sum, max, min values in a document
in tourController.js

NOTE: VIRTUAL PROPERTIES
in tourModel.js

NOTE: IMPORTANT MIDDLEWARE
in tourModel.js

1. DOCUMENT middlelware -> runs each time a new document is saved , can run BEFORE the save happens or AFTER the save happens /slug creation

2. QUERY middleware: before or after a certain query is executed / secret doc creation

3. AGGREGATION MIDDLEWARE -> preventing use of secret tour

NOTE: VALIDATIONS
PLAIN CUSTOM VALIDATOR
in tourModel.js
checking if input values match our requirements

CUSTOM VALIDATORS using VALIDATOR PACKAGE
npm i validator

NOTE: ERROR HANDLING

in app.js

1. HANDLING UNHANDLED ROUTES - routes that are not present for eg: 'api/v1/tours/sjfhhwsoj ....'

2. GLOBAL ERROR HANDLING FUNCTION and ERROR DURING PRODUCTION vs DEVELOPMENT SETUP
3. ERROR CLASS -> in utils folder
4. after class creation import in app.js and test

---- follow tourCOntroller from now on!! 5. CATCHING ERROR IN ASYNC FUNCTIONS -> modify all functions 6. export it into catchAsync.js in utils 7. wrap all blocks into catchAsync

8. ADDING 404 ERRORS
   no tour with getTour in tourController.js

NOTE: 3 OPERATIONAL ERRORS TO FIX

all done in errorController.js

1. HANDLING INVALID IDS in getTour function
2. DUPLICATE NAME ERROR while creating tour and UPDATING tours with wrong data
3. VALIDDATION ERROR: wrong data while updating tour

in server.js

4. DATABASE CONNECTION ERROR: / UNHANDLED REJECTIONS -> or unhandled promise errors
5. UNCAUGHT EXCEPTIONS -> errors in synchronous code but is not caught anywhere

NOTE: JWT AUTHENTICATION - IMPORTANT

1. create a user model AND manage password ->
** checking if password confirm === password 
** switching out the user's password with an encrypted password USING bcrypt
npm i bycrptjs
** deleting the passwordConfirm field

--  ADVISED TO MAKE A userController.js file and add the getAllUsers function and add that route to userROute.js

2. make a authController.js file
3. create new user function
4. create a user route called signup and add that route to the app.js file

5. MAIN
install JWT
npm i jsonwebtoken

in authController.js
** LOGGING IN THE USER as THEY SIGN UP
 create a JWT_SECRET in the config file and EXPIRES IN

** LOGGING IN USERS
make the login function in authController
add the route in userRoutes.js

** PROTECTING ROUTES
1. in authController create protect function
2. add that protect function in front of the getAllTours function in the tourRoutes
3. go to POSTMAN and the getAllTours request -> go to the authorization tab and add Authorization and Bearer values
4. starting writing code in the protect function
5. need to handle JsonWebToken error AND TokenExpiredError -> go to errorController.js and add that functionality

NOTE: USER ROLE AND PERMISSIONS
1. make sure the role object is present in model
2. add that restrictTo() function in the tourRoutes for deleting

NOTE: PASSWORD RESET -> 

NOTE: 1) FORGOT PASSWORD
** ONE STEP IS TO send email to the user 
** create email.js in utils folder
npm i nodemailer


FOR GMAIL: 

set EMAIL_USERNAME=tarunv1911@gmail.com
EMAIL_PASSWORD=*****

const transporter = nodemailer.createTransporter({
   service: 'Gmail',
   auth: {
      user: process.env.EMAIL_USERNAME
      pass: process.env.EMAIL_PASSWORD
   }

   Activate in gmail 'less secure app' option
})
 --------------------------

to prevent mails from reaching users sign in to mailtrap
inboxes -> add inbox -> give it a name -> and click on the newly created mail

copy the USERNAME AND PASSWORD option and set them up in the config file under EMAIL_USERNAME and EMAIL_PASSWORD

after all code export it and import in authController.js

i fyou go to postman to the forgotPassword route and input email in body the success status should come and mail should be in mailtrap

NOTE: 2) RESET PASSWORD
in authController.js

NOTE: UPDATING CURRENT USER'S PASSWORD

NOTE: UPDATE USER DATA -> userController
add function and add route in userRoutes

NOTE: DELETING A USER ACCOUNT
create active filed in user modal
set the active to false in the userController.js

NOTE: storing JWT token as a cookie
filter out the func into a simple fucn

NOTE: SECURITY
1. rate limiting -> app.js
npm i express-rate-limit 
and use it as a middleware

2. http headers
npm i helmet

3. data sanitization
#1) NoSQL query injection
npm i express-mongo-sanitize

#2 attacks against XSS
npm i xss-clean

4. parameter pollution
npm i hpp

NOTE: MODELLING DATA
in tourModel.js

1. NOTE: GEOSPATIAL DATA
data that describes places on earth using longitude and latitude

2. NOTE: CHILD referencing -> guides
in model make the field and add ref
2. make the popualte middlelware in tourModel.js

NOTE: PARENT REFERENCING -> reviews
1. make review model

NOTE: up to now we referenced the tour from the review that is like this REVIEW -> tour but what if we wanted to do it the other wy around like this TOUR -> review, getiing access to reviews FROM a tour. To do that we use virtual populate 

middleware function in tourModel.js

NOTE: nested route functionality
create that route in tourRoutes.js