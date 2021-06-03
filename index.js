const Joi = require('joi');
const e = require('express');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    { id : 1 , name : 'course1' },
    { id : 2 , name : 'course2' },
    { id : 3 , name : 'course3' }
]

//this app object has various methods
//get, post, put, delete
app.get('/', (req, res) => {
    res.send('Hello World!!!');
});


app.get('/api/courses', (req, res)=> {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res)=> {
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course){
        return res.status(404).send('The course id doesnt exist');
    }
    res.send(course)
});

app.post('/api/courses', (req, res) => {

    //input validation using Joi
    // const schema = Joi.object({
    //     name: Joi.string().min(3).required()
    // });

    // const result = schema.validate(req.body);
    // console.log(result);
    // //input validation
    // if(result.error) {
    //     //400 bad request
    //     res.status(400).send(result.error.details[0].message)
    //     return;
    // }
      
    //refactor- destructure the object
    const { error } = validateCourse(req.body);
        if(error) {
          //400 bad request
        return res.status(400).send(error.details[0].message)
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);

});

app.put('/api/courses/:id', (req, res) => {
    // Look up the course with this id
    //if not exists, returns 404
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course id doesnt exist')

    //validate 
    //if invalid, return 400 - bad request
  //  const result = validateCourse(req.body);

    //refactor- destructure the object
    const { error } = validateCourse(req.body);
    if(error) {
        //400 bad request
        res.status(400).send(error.details[0].message)
        return;
    }

    //Update Course
    course.name = req.body.name;

    //Return the updated course
    res.send(course)
});

app.delete('/api/courses/:id', (req, res) => {
    //Look up the course
    //doesnt exist - return 404
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course id doesnt exist')

    //delete
    const index = courses.indexOf(course);
    courses.splice(index, 1)

    res.send(course);
})

// Environment variable PORT
//use the process object to use PORT or 3000
const port = process.env.PORT || 3000
app.listen(3000, ()=> console.log(`Listening on port ${port}`))


function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(course);
}