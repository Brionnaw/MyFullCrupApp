// IMPORT MODULES
import express = require ('express');
let router = express.Router();
let mongoose = require('mongoose');
let Post = mongoose.model('Post', { // "," seperate parameters, {pass in name of model , object w| properties, values types}
    companyName: String,
    companyDomain: String,
    tag:String,
      question:{
        type: Object,
        default: null
      },
      interviewType: String,
      positionTitle:String,
      authorPhoto:String,
      author: String,
      dateCreated: Date,
      dateDeleted: {
        type: Date,
        default: null
  }
});

//MODEL
let Company = mongoose.model('Company', {
  companyName:{
    type:String,
    unique:true
  },
  domain:String,
});

// POST TO UPDATE OR CREATE POSTS
router.post('/posts/feed', function(req, res) {
  if (req.body.id === undefined){
    Company.find({companyName:req.body.companyName}).then(function(response) {
        if(response.length === 0){
          let newCompany = new Company ({
            companyName: req.body.name,
            domain:req.body.domain
          })
          newCompany.save((err, company) => { // conditionals to create a new company
            if(err) {
              console.log(err)
              res.end()
            } else {
              let newPost = new Post ({
                companyName: req.body.name,
                companyDomain: req.body.domain,
                tag:company._id,
                interviewType: req.body.interviewType,
                authorPhoto: req.body.authorPhoto,
                positionTitle:req.body.positionTitle,
                question: req.body.question,
                author:req.body.username,
                dateCreated:new Date()
              })
              newPost.save((err, post) => {
                if(err){
                  console.log(err)
                  res.end()
                } else {
              res.send(post);
            }
          })
         }
       })
      }
    })
  } else {
    Company.findOne({_id : req.body.tag}).then(function(company){
      Post.findByIdAndUpdate(req.body.id,
        {$set:{
          companyName: company.companyName,
          companyDomain: req.body.domain,
          tag:req.body.tag,
          question: req.body.question,
          interviewType: req.body.interviewType,
          positionTitle: req.body.positionTitle,
          authorPhoto:req.body.authorPhoto,
          author: req.body.username,
          dateCreated: new Date()
        }
      },
      (err, post) => {
        if (err) {
          console.log(err);
          res.end()
        } else {
          console.log(post);
          res.send('success')
        }
      });
    })
  }
});

//GET ALL POSTS
router.get('/posts/company/:name', function(req , res, next) {
  Company.find({companyName:req.params["name"]}).then(function(company) {
    console.log(company)
    if(company.length < 1) {
      console.log('nothing found')
      res.send(['not found']);
    } else {
      req.body.companyInfo = company;
      next('route') //middleware
    }
  })
});

router.get('/posts/company/:name', function(req , res, next) {
  Post.find({tag: req.body.companyInfo[0]._id}).then(function(companyPosts) {
    res.send(companyPosts);
  });
});

//DELETE A POST
router.delete('/posts/feed/:id', function (req, res) {
  Post.findByIdAndUpdate(req.params["id"], {$set:{dateDeleted:new Date()}}, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      res.send('success!')
    }
  });
});

// GET POSTS THAT AREN'T DELETED //
router.get('/posts/feed/:id', function (req, res){
  Post.find({author:req.params["id"], dateDeleted:null}).then(function(allProfilePosts){
    res.send(allProfilePosts);
  })
});

// CHECK IF COMPANY POSTS ARE FOUND ON FEED.HTML
router.post('/posts/company', function (req, res){
  console.log(req.body.company)
  Post.find({companyName:req.body.company}).then (function(foundPosts){
    if(foundPosts.length < 1) {
      res.send({message: 'false'}); // if posts are not found
    } else {
      res.send(foundPosts[0]);
    }
  })
});




export = router;
