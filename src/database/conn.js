const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/loginform',
{ useNewUrlParser: true, 
 useUnifiedTopology:true
}).then(() =>
console.log("connection is successfull")).catch((err)=> console.log(err));
