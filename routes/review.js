const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync");
const {reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const { isLoggedIn, isReviewAuthor,validateReview } = require("../middleware.js");


const reviewController=require("../controllers/review.js");
//review route

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deletereview));

module.exports=router;
