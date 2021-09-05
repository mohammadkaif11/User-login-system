#  Login System and User Registraiton System in nodejs with mongodb and express
 

## Features login system
 
 
-password hashing

-user authentication

-mongodb Nosql database 

-full user login and RegistrationSystem
  
  ## Require Package 

```bash
	  npm install express
	  npm install mongoose
	  npm install hbs
          npm install cookie-parser
          npm install jsonwebtoken
          npm install dotenv
          npm install bcryptjs
```
# hashing function 
    // function convert user password into hash    //password and store hash password in database
    userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
    next();
    });
    //compare hashpassword and userpassword when   //user login
    bcrypt.compareSync(password, data.passwordhash)
# function(Genrate Token)
    userSchema.methods.genrateToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id.toString()}, "process.env.SECRET_KEY")
        this.tokens = this.tokens.concat({ token });
        await this.save();
        return token;
    } catch (error) {
        res.send(error);
    }
    }

# function(User Authentication)
    const auth =async(req,res,next)=>{
    try {
    const token = req.cookies.jwt; 
    
    const verfiyuser=jwt.verify(token,"process.env.SECRET_KEY");
    const user=await User.findOne({_id:verfiyuser._id});
    req.token=token;
    req.user=user;
    next();   
    } catch (error) {
        res.status(401).send(error);
    }
    }
