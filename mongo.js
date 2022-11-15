// import { createRequire } from 'module';
// import { stringify } from 'querystring';
const date = require("joi/lib/types/date");
const string = require("joi/lib/types/string");
const mongoose = require("mongoose");
const nodemon = require("nodemon");

const connect = async () => {
  const connection = await mongoose.connect("mongodb://localhost/playground");
  if (!connection) {
    console.log("not connected to database", connection);
    return false;
  }
  console.log("connected to database");
};

connect();

const courseSchema = mongoose.Schema({
  name: {type: String , required: true},
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "html",
    author: "prabhakar",
    tags: ["ruby", "Application"],
    isPublished: false,
  });

  try{
    const result = await course.save();
  console.log(result);
  }
  catch(ex){
    console.log(ex.message);
  }
}

async function getCourse() {
  const result = await Course.find()
  //  author: "prabhakar", ispublished: true
  //   .limit(10)
    // .sort({ name1: -1 });
    
    .select({ name1: -1, tags: 1})
    // .and([{name1:'java'}, {isPublished:true}])// 1 is for sorting alphabetically and -1 is for reverse
    .count();
    console.log(result);

  //       comperision operators

  //      .find({price:{$gte:10, $lte:20}})               >>>>>>> finding the courses between $10 to $20
  //      .find({price:{ $in:[10, 15, 20 ] } })           >>>>>>finding the courses of price $10, $15, $20

  //logical query operatiors >>>>>   OR & AND

  //      .or([{author:'prabhakar'}, {isPublished:true}])
  //      .and([{author:'prabhakar'}, {isPublished:false}])

  // Regular expression

  // author name starts with "Prabhakar"

  //      .find({author: /^prabhakar/})

  //author name end with "chauhan"

  //      .find({author: /chauhan$/i})  >>>>>> using  "i" for making the search query case insensitive

  //author name contains "prabhakar"

  //      .find({author:/.*prabhakar.*/})

  //      .count()    >>>>>>>>>>>>> Count all the document which matches all the above criteria
}

// getCourse();
createCourse();

//pagination>>>>>>>>>>>>>>>

/* async function getCourse(){
        const pageNumber = 2;
        const pageSize = 10;

        const courses= await Course
        .find({author:'Prabhakar', isPublished:true})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        
        console.log(courses);
} 
 */

async function updateCourse(id){

  const course = await Course.findById(id);
  if(!course) return;
  course.name1 = "php";
  course.author = 'jhon'

  const result = await course.save();
  console.log(result);
}

// updateCourse("636dd58df140b38122fbb9c7");


async function putCourse(id){

  const course = await Course.findByIdAndUpdate({_id:id} , {

    $set: {
      name1:'c-sharp',
      author:'alexa',
      price:'costly'
    }
  }, {new: true});
  console.log(course);
}

// putCourse("636dd73a58c887023282d60e");


async function deleteCourse(id){

  const result = await Course.deleteOne({_id:id});

  console.log(result);
}

// deleteCourse("636f294a6b1b5cd4c5cda7b5");
