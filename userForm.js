const Express = require("express");
const Joi = require("joi");

const User = Express();
User.use(Express.json());

const user = [
  { 
    id: "integer",
    name1: "string",
    email: "string",
    phone: "integer" 
},
];

User.get("/", (req, res) => {
  res.send("I am live on the server");
});

const port = process.env.PORT || 4000;
User.listen(port, () => {
  console.log("i am live again");
});
