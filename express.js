const Joi= require('joi');
const express = require('express');

const app = express();
app.use(express.json());

const courses=[
    {id:1, name:'javaScript', author:'unknown'},
    {id:2, name:'nodejs', author:'unknown1'},
    {id:3, name:'html', author:'unknown2'}
];

app.post('/api/admin/courses', (req, res)=>{
    const schema={
        name:Joi.string().min(3).required()
    };
    const result= Joi.validate(req.body, schema);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
});



app.get('/api/admin/courses',(req, res)=>{
    res.send(courses);
});

app.post('/api/admin/courses',(req, res)=>{
    const course={
        id: course.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

//look for the course and it is un available empty request 404
app.get('/api/admin/courses/:id', (req, res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status('404').send('The course you are looking for is not found.');

    
    
//check for the valadity of the course if not valid return bad request
app.post('/api/admin/courses', (req, res)=>{
    const {error}= validateCourse(req.body);

    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

//if the request is valid then update the course>>>>>>>>
course.name = req.body.name;
res.send(course);



app.get('/api/admin/courses/:id', (req, res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status('404').send('The course you are looking for is not found.');
    res.send(course);
});

const PORT = process.env.port|| 3000;


app.listen(PORT, () => console.log(`listening on the port ${PORT}...`));


function validateCourse(course){
    const schema={
        name:Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);

}