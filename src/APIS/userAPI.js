//importing express module
const exp = require('express')

//creating a mini application
const userExpApp = exp.Router();

//exporting to main server file
module.exports = userExpApp;

const bcrypt = require('bcrypt');


//nodemailer
const nodemailer = require('nodemailer')

//importing jsonwebtoken module
const jwt = require('jsonwebtoken')

//body parsing
userExpApp.use(exp.json())

//getting db url
const dbUrl = 'mongodb://vchanti679:9393490610@cluster0-shard-00-00-hfzzf.gcp.mongodb.net:27017,cluster0-shard-00-01-hfzzf.gcp.mongodb.net:27017,cluster0-shard-00-02-hfzzf.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'

var dbo;

//importing mongodb module
const mc = require('mongodb').MongoClient

//connecting to database
mc.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true }, (err, clientObj) => {
    if (err) {
        console.log('err in connecting', err)
    }
    else {
        dbo = clientObj.db('Imsdb')
    }
})

userExpApp.get('/readattd/:bn', (req, res) => {
    var bno = (req.params.bn)
    dbo.collection('attendence').find({ batchno: bno }).toArray((err, stdAttd) => {
        if (err) {
            console.log('err in find', err)
        }
        else if (stdAttd.length == 0) {
            res.send({ message: 'no std data found' })
        }
        else {
            res.send({ message: stdAttd })
        }
    })
})

userExpApp.get('/readmarks/:bn', (req, res) => {
    var bno = (req.params.bn)
    dbo.collection('marks').find({ batchno: bno }).toArray((err, stdmarks) => {
        if (err) {
            console.log('err in find', err)
        }
        else if (stdmarks.length == 0) {
            res.send({ message: 'no std data found' })
        }
        else {
            res.send({ message: stdmarks })
        }
    })
})

userExpApp.get('/userdetails/:id', (req, res) => {

    dbo.collection('collection1').findOne({ imsid: req.params.id }, (err, detls) => {
        if (err) {
            console.log('err in find', err)
        }
        else (
            res.send({ message: detls })
        )
    })
})

userExpApp.post('/forgotpassword', (req, res, next) => {
    dbo.collection('collection1').find({ email: req.body.email }).toArray((err, userArray) => {
        if (err) {
            next(err)
        }
        else {
            if (userArray.length == 0) {
                res.send({ "message": "user not found" })
            }
            else {

                jwt.sign({ firstname: userArray[0].firstname }, "skey", { expiresIn: 3600 }, (err, token) => {
                    if (err) {
                        next(err);
                    }
                    else {
                        var OTP = Math.floor(Math.random() * 99999) + 11111;

                        // sending otp to user
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'sidekick976@gmail.com',
                                pass: 'liamg321'
                            }
                        });

                        var mailOptions = {
                            from: 'ims',
                            to: `${req.body.email}`,
                            subject: 'Password reset request',
                            html: `<h3>Hi ${userArray[0].firstname},your password reset otp is</h3> 
                                    <br> <h1> ${OTP} </h1> <br> Please set easily remembered and strong password.
                                    <br> Thankyou `
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                                //insert otp
                                dbo.collection('OTPCollection').insertOne({
                                    OTP: OTP,
                                    firstname: userArray[0].firstname,
                                    OTPGeneratedTime: new Date().getTime() + 120000
                                }, (err, success) => {
                                    if (err) {
                                        next(err)
                                    }
                                    else {
                                        res.send({
                                            "message": "otp sent",
                                            // "token": token,
                                            // "OTP": OTP,
                                            // "userName": userArray[0].firstname
                                        })
                                    }
                                })
                            }
                        })
                    }

                })
            }
        }
    })
})

//verify OTP
userExpApp.post('/verifyotp', (req, res, next) => {
    // console.log(req.body)
    // console.log(new Date().getTime())
    var currentTime = new Date().getTime()
    dbo.collection('OTPCollection').find({ OTP: req.body.OTP }).toArray((err, OTPArray) => {
        if (err) {
            next(err)
        }
        else if (OTPArray.length === 0) {
            res.send({ "message": "invalidOTP" })
        }
        else if (OTPArray[0].OTPGeneratedTime < currentTime) {
            res.send({ "message": "invalidOTP" })
        }
        else {

            dbo.collection('OTPCollection').deleteOne({ OTP: req.body.OTP }, (err, success) => {
                if (err) {
                    next(err);
                }
                else {
                    res.send({ "message": "verifiedOTP" })
                }
            })
        }
    })
})

//changing password
userExpApp.put('/changepassword',(req,res,next)=>{
    console.log(req.body)
    bcrypt.hash(req.body.pwd,6,(err,hashedPassword)=>{
        if (err) {
            next(err)
        } else {
            dbo.collection('collection1').updateOne({email:req.body.email},{$set:{
                pwd:hashedPassword
            }},(err,success)=>{
                if(err){
                    next(err)
                }
                else{
                    res.json({"message":"password changed"})

                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'sidekick976@gmail.com',
                          pass: 'liamg321'
                        }
                      });
                      
                      var mailOptions = {
                        from: 'ims',
                        to: `${req.body.email}`,
                        subject: 'password Update request',
                        html: `<h3>Hi ${req.body.firstname},your password updated succesfully</h3> 
                        <br> <p> Thank you for using our service</p>`
                      };
                      
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                      });
                }
            }) 
        }
    })
    
})