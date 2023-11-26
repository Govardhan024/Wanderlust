const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateLissting } = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
//index route
.get(wrapAsync(listingcontroller.index))
//create route
.post( isLoggedIn,upload.single("listing[image]"),validateLissting, wrapAsync(listingcontroller.renderCreateForm));

//new route
router.get("/new", isLoggedIn, listingcontroller.rendernewform);

router.route("/:id")
//show route
.get(wrapAsync(listingcontroller.showListing))
//update route
.put(isLoggedIn, isOwner,upload.single("listing[image]"),validateLissting, wrapAsync(listingcontroller.updateListing))
//delete route
.delete( isLoggedIn, isOwner, wrapAsync(listingcontroller.deleteListing));





//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingcontroller.renderEditForm));




module.exports = router;