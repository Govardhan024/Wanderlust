
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
//const dbUrl=process.env.ATLASDB_URL;


const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const ExpressError=require("./utils/ExpressError");

const MongoStore = require('connect-mongo');


app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl:MONGO_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("EROOR in MONGO session store",err);
});
const sessionOptions={
    store,
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js")

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//        email:"student@gmail.com",
//        username:"delta-student"
//     });
//    let registeredUser=await User.register(fakeUser,"helloworld");
//    res.send(registeredUser);
// });


main().then(()=>{
    console.log("connected to db");
 }).catch((err)=>{
    console.log(err);
 })
 async function main(){
    await mongoose.connect(MONGO_URL);
 }
 app.set("view engine" , "ejs");
 app.set("views",path.join(__dirname,"views"));
 app.use(express.urlencoded({extended : true}));
 app.use(methodOverride("_method"));
 app.engine("ejs",ejsMate);
 
 



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//        title: "my villa",
//        descreption:"By the beach",
//        price:1200,
//        location:"Calangute, Goa",
//        country:"India"
//     });
//     await sampleListing.save();
//         console.log("sample was saved");
//         res.send("successful testing")
    
// })
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="somethings went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
   
});
app.listen(8080,()=>{
    console.log("server is listening to port");   
});
