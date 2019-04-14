const express = require('express');

//We cannot use the express method here because, we use its Object called Router when it 
//being called as module
const router = express.Router();

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
];


//-----------------
//Route parameters
//----------------
router.get('/:id', (req, res) => {
    // res.send(req.params.id);
    //Use let if you wanna define a variable that you can reset later, and const for constant
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');
    res.send(course);
});

//--------------------------------------------- Handling HTTP GET Request ---------------------------------//

router.get('/', (req, res) => {
    res.send(courses);
});

//--------------------------------------------- Handling HTTP POST Request ---------------------------------//
//We will test it using postman
router.post('/', (req, res) => {
    //Input validation must be implemented, you cannot trust the client

    const schema = {
        name: Joi.string().min(3).required()
    };

    //Now validate the input against the defined schema
    let result = Joi.validate(req.body, schema);

    if (result.error) { //!req.body.name || req.body.name.length < 3
        //400 Bad request
        //If the client send something bad, send a feedback with a bad request
        res.status(400).send(result.error.details[0].message);
        return; // to stop the rest of the application to continue
    }

    let course = {
        id: courses.length + 1,
        name: req.body.name //For this body to work, we need to pass in the body as json by using router.use()
    };
    courses.push(course);
    //The client might want to know about the id of the course or something, so we send it back
    res.send(course);
});

//--------------------------------------------- Handling HTTP PUT Request ---------------------------------//
router.put('/:id', (req, res) => {
    //Look up the course
    //If not existing, return 404
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');

    //Validate 
    //If invalid, return 400 - Bad request
    //Using object abstraction syntax
    const { error } = validateCourse(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    //Update course
    course.name = req.body.name;

    //Return the updated course
    res.send(course);
});


//--------------------------------------------- Handling HTTP PUT Request ---------------------------------//
router.delete('/:id', (req, res) => {
    //Look up the course
    //Not existing, return 404
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.send(404).send('The course with the given ID was not found');

    //Delete
    let index = courses.indexOf(course);
    courses.splice(index, 1);

    //Return the same course
    res.send(course);
});

//Function to validate
function validateCourse(course) {
    let schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

module.exports = router;