const express = require('express');
const mongoose = require('mongoose');
const User = require('../Models/User');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

var multer, storage, path, crypto;
multer = require('multer')
path = require('path');
crypto = require('crypto');

const route = express.Router();


const register = (req,res,next) => {
	bcrypt.hash(req.body.password,10,function(err,hashedPass) {
		console.log(req.body);
		if (err) {
			console.log('erreur hash');
			res.json({
				error: err
			})
		}
		var verifemail = req.body.email

		User.findOne({$or: [{email:verifemail}]})
		.then(user => {
			if (user) {//user found
				res.status(201).send(JSON.stringify({
					message:'User exist'
				}))
			}else{//no user found
				let user = new User({
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					email: req.body.email,
					password: hashedPass,
					phone: "90057620",
					sexe: "homme",
					avatar:"default"
				})
				user.save().then(user =>{
					res.status(200).send(JSON.stringify({
						message:'User Added Successfully!'
					}))
				})
				.catch(error => {
					res.json({
						message: "An error occured when adding user!"
					})
				})
			}//end else
		})//end then 
	})//end hash
}

const login = (req,res,next) => {
	var email = req.body.email
	var password = req.body.password

	User.findOne({$or: [{email:email},{phone:email}]})
	.then(user => {
		if (user) {
			bcrypt.compare(password,user.password,function(err,result) {
				if (err) {
					res.json({error:err})
				}
				if (result) {
					let token = jwt.sign({firstName:user.firstName},'verySecretValue',{expiresIn: '1h'})
					res.status(200).send(JSON.stringify({
					_id:user._id,
					firstName:user.firstName,
					lastName:user.lastName,
					email:user.email,
					password:user.password,
					phone:user.phone,
					sexe:user.sexe,
					avatar:user.avatar
					}))
				}else{	
					res.status(201).send(JSON.stringify({
						_id:"",
						firstName:"",
						lastName:"",
						email:"",
						password:"",
						phone:"",
						sexe:"",
						avatar:""
					}))
				}
			})
		}else{
			res.status(202).send(JSON.stringify({
				_id:"",
				firstName:"",
				lastName:"",
				email:"",
				password:"",
				phone:"",
				sexe:"",
				avatar:""
			}))
		}
	})
}

//show product list
const index = (req,res,next)  => {
	User.find()
	.then(response  => {
		res.json(response)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying users"
		})
	})
}
var fs = require('fs');
storage = multer.diskStorage({
    destination: './public/users/',
    filename: function(req, file, cb) {
      return crypto.pseudoRandomBytes(16, function(err, raw) {
        if (err) {
          return cb(err);
        }
       return cb(null, file.originalname);
      });
    }
  });

const updateAvatar = (req,res,next) =>{

	let updatedUser = {
		avatar: req.body.avatar
	}

	User.findOneAndUpdate({ email: req.body.email },{$set: updatedUser})
	.then(() => {
		res.json({
			message: "user updated successfully"
		})
	})
	.catch(error => {
		res.json({
			message: "an error occured when updating user"
		})
	})
}

route.post('/updateAvatar/',updateAvatar)
route.get('/',index)
route.post('/login',login)
route.post('/register',register)
route.post("/upload", multer({
    storage: storage
  }).single('upload'), function(req, res) {
	//res.redirect("/uploads/" + req.file.filename +"/"+req.body.email);
    /*res.json({
		avatar: req.file.filename
	})*/
	res.status(200).send(JSON.stringify({
				avatar: req.file.filename
			}))
  });




//route.get('/updateAvatar/:avatar/:email',updateAvatar)
//route.post('/updateAvatar/',updateAvatar)

module.exports = route;