const Joi = require('joi');
const Express = require('express');
const { application } = require('express');
const { min } = require('joi/lib/types/array');

const test = Express();
test.use(Express.json());

const Movies= [
              {id:1, name:'movie1', rating:4.3},
              {id:2, name:'movie2', rating:4.2},
              {id:3, name:'movie3', rating:1.2}
];

test.get('/api/movies', (req, res)=>{
    res.send(Movies);
});

test.get('/api/movies/:id', (req,res)=>{
    const movie = Movies.find(c => c.id === parseInt(req.params.id));
    if(!movie) res.status('404').send('The movie with the given id is not available');
    res.send(movie);
    
});

test.post('/api/movies/:id', (req, res)=> {

    const{error}= Joi.validate(req.body, schema);
                         
    if(error){
        res.status(404).send(error.details[0].message);
        return;
      }

const movie = {
    id:Movies.length + 1,
    name: req.body.name,
    rating:req.body.rating
};
Movies.push(movie);
res.send(movie);
});

test.put('/api/movies/:id', (req, res)=>{

//looking up the movie, if not found return, 404
  
    const movie=Movies.find(c => c.id === parseInt(req.params.id));
    if(!movie) res.status(404).send('please provide a valid input');
    // res.send(movie);
//dont have to check the data is available or not so dosen't need any response
    
//validation of the provided input

const {error}= validateMovie(req.body);

 if(error){
    res.status(400).send(error.details[0].message);
    return;
 }

 //updating the data

 movie.name = req.body.name; 
 movie.rating = req.body.rating;
 console.log('movies', movie);
 res.send(Movies);

});

test.delete('/api/movies/:id', (req, res) =>{
    const movie= Movies.find(c=> c.id === parseInt(req.params.id));
    if(!movie) res.status(404).send('The movie with the given id is not available');
    
    const index = Movies.indexOf(movie);
    Movies.splice(index , 1);

    res.send(movie);
})

function validateMovie(movie){ 
    const schema = {
        name: Joi.string().min(3).required(),
        rating:Joi.number()
        .integer()
        .required()
    };
    
   return Joi.validate(movie, schema);
}

const port = process.env.PORT || 3000;

test.listen(port, () => console.log(`Listening on the port ${port}....`));