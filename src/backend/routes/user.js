const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
var mongoose = require("mongoose");
const { ObjectId } = require("mongodb");


/**
 * Verifies a jsonWebToken
 * 
 * @param {String} cookie 
 * @returns 
 */
function checkAuthentication(cookie) {
  try {
    const claims = jwt.verify(cookie, "secret");

    if (!claims) {
      return {authResult: false};
    }

    return {authResult: true, claims: claims};

  } catch (error) {
    console.log("unauthenticated: " + error)
    return {authResult: false};
  }
}


router.post("/register", async (req, res) => {
  var user = await User.findOne({ username: req.body.username }).catch((err) =>
    console.error(err)
  );
  
  if (user != undefined) {
    return res.status(404).send({
      message: "userNameAlreadyExists",
    });
  } else {
     user = await User.findOne({ mail: req.body.mail }).catch((err) =>
      console.error(err)
    );
  }

  if (user != undefined) {
    return res.status(404).send({
      message: "userMailAlreadyExists",
    });
  }

  const salt = await bcrypt.genSalt(10).catch(err => console.error(err));

  const hashedPassword = await bcrypt.hash(req.body.password, salt)
    .catch((err) => console.error(err));

  const newUser = new User({
    username: req.body.username,
    mail: req.body.mail,
    password: hashedPassword,
    activities: req.body.activities,
  });

  const result = await newUser.save().catch((err) => console.error(err));
  

  const { password, ...data } = await result.toJSON();

  res.send(data);
});

router.post("/login", async (req, res) => {

  const user = await User.findOne({ username: req.body.username })
    .catch((err) => console.error(err));

  if (!user) {
    return res.status(404).send({
      message: "userNotFound",
    });
  }

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).send({
      message: "invalidCredentials",
    });
  }

  const token = jwt.sign({ _id: user._id }, "secret");

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.send({
    user: {
      _id: user._id,
      username: user.username, 
      mail: user.mail,
      activities: user.activities
    }
  });
});

router.get("/", async (req, res) => {
  const { authResult, claims } = checkAuthentication(req.cookies["jwt"]);

  if (authResult) {

    try {
      
      const user = await User.findOne({ _id: claims._id });
      
      const { password, ...data } = user.toJSON();
      
      res.send(data);

    } catch (error) {
      return res.status(401).send({
        message: "No user found: " + error,
      });
    }
  } else {
    return res.status(401).send({
      message: "unauthenticated",
    });
  }
  });
  
router.get("/name/:username", async (req, res) => {
  try {
    const user = await User.findOne({username: req.params.username});

    console.log(user)
    res.status(200).send({user})
  } catch (error) {
    res.status(404).send("Failed: " + error);
  }
})

router.get("/id/:user_ids", async function (req, res, next) {
  var user_ids = req.params.user_ids.split(",");

  // cast user_ids to ObjectId objects
  var newArray = [];
  for (var i = 0; i < user_ids.length; i++) {
    newArray[i] = new mongoose.Types.ObjectId(user_ids[i]);
  }

  try {
      const users = await User.find({
        _id: { $in: newArray },
      });

      res.status(200).send(users);
    } catch (error) {
      res.status(404).send("Failed: " + error);
    }
});

/**
 * Edit logged in user
 */
router.put("/", async (req, res) => {


  const {authResult, claims} = checkAuthentication(req.cookies["jwt"]);
  if (authResult){
    try {
      const result = await User.findByIdAndUpdate(claims._id, req.body);

      res.status(200).send(result);
    } catch (error) {
      res.status(500).send("Couldn't edit User: " + error.message);
    }
  } else {
    return res.status(401).send({
      message: "unauthenticated",
    });
  }
})

/**
 * Edit other user
 */
router.put("/:user_id", async (req, res) => {

    try {
      const result = await User.findByIdAndUpdate(req.params.user_id, req.body);

      res.status(200).send(result);
    } catch (error) {
      res.status(500).send("Couldn't edit User: " + error.message);
    }
})


router.post("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });

  res.send({
    message: "success",
  });
});

module.exports = router;
