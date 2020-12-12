//importing express module
const exp = require('express')

//importing jsonwebtoken module
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

//creating a mini application
const adminExpApp = exp.Router();

//exporting to main server file
module.exports = adminExpApp;

//body parsing
adminExpApp.use(exp.json())

//nodemailer
const nodemailer = require('nodemailer')


//import require modules
const multer = require('multer');
const xlsxtojson = require("xlsx-to-json-lc");
const xlstojson = require("xls-to-json-lc");

//importing ids generating module
const stdId = require('../middleware/generateids')


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
        console.log('connected to database')
    }
})

//login request handler
adminExpApp.post('/login', (req, res) => {
    dbo.collection('collection1').findOne({ role: req.body.role }, (err, adminobj) => {
        if (err) {
            console.log('err in find', err)
        }
        else if (adminobj == null) {
            res.send({ message: 'invalid role' })
        }
        else {
            dbo.collection('collection1').findOne({ role: req.body.role, imsid: req.body.imsid }, (err, resl) => {
                if (err) {
                    console.log('err in find', err)
                }
                else if (resl == null) {
                    res.send({ message: 'invalid id' })
                }
                else {
                    //compare password
                    bcrypt.compare(req.body.pwd, resl.pwd, (err, isMatched) => {
                        if (err) {
                            console.log('err in compare', err)
                        }
                        else if (isMatched == false) {
                            res.send({ message: 'invalid password' })
                        }
                        else {
                            //generating token
                            jwt.sign({ firstname: resl.firstname }, 'signed', { expiresIn: 60 }, (err, signedToken) => {
                                if (err) {
                                    console.log('err in token generation', err)
                                }
                                else {
                                    res.send({ message: resl, token: signedToken, userid: resl.imsid })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})



//request handlers
adminExpApp.post('/register', stdId, (req, res) => {
    dbo.collection('collection1').findOne({ imsid: req.body.imsid, email: req.body.email }, (err, studentobj) => {
        if (err) {
            console.log('err in find', err)
        }
        else if (studentobj == null) {
            var autopass = req.body.imsid
            //hashing password
            bcrypt.hash(autopass, 8, (err, hashedpass) => {
                if (err) {
                    console.log('err in hashing', err)
                }
                else {
                    //replacing plain password with hashedpass
                    req.body.pwd = hashedpass
                    //insert in db
                    dbo.collection('collection1').insertOne(req.body, (err, result) => {
                        if (err) {
                            console.log('err in inserting', err)
                        }
                        else {
                            res.send({ message: 'Student Registered' })

                            //step-1
                            const transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'sidekick976@gmail.com',
                                    pass: `liamg321`
                                }
                            });
                            // Step 2
                            let mailOptions = {
                                from: 'ims',
                                to: `${req.body.email}`,
                                subject: 'Registration successful',
                                html: `<h2>Hi ${req.body.firstname},Welcome</h2> <br> 
                                        <p>you have been successfully registered with geboomba institute using ims. 
                                        your userid & password; <br> userid & password ${req.body.imsid},
                                        you can change credentials after initial login</p>`
                            };
                            // Step 3
                            transporter.sendMail(mailOptions, (err, data) => {
                                if (err) {
                                    console.log('Error occurs', err);
                                }
                                else {
                                    console.log('Email sent!!!');
                                }
                            });
                        }
                    })
                }
            })

        }
        else {
            res.send({ message: 'data already existed' })
        }
    })
})




adminExpApp.get('/readAll/:bn', (req, res) => {
    var bno = (+req.params.bn)
    dbo.collection('collection1').find({ batch: bno }).toArray((err, stdArray) => {
        if (err) {
            console.log('err in find', err)
        }
        else if (stdArray.length == 0) {
            res.send({ message: 'no std data found' })
        }
        else {
            res.send({ message: stdArray })
        }
    })
})


adminExpApp.delete('/remove/:email', (req, res) => {
    var del = (req.params.email)
    dbo.collection('collection1').findOne({ email: del }, (err, deleted) => {
        if (err) {
            console.log('console.log', err)
        }
        else if (deleted == null) {
            res.send({ message: 'no data found to delete' })
        }
        else {
            dbo.collection('collection1').deleteOne({ email: del }, (err, done) => {
                if (err) {
                    console.log('err in deleting', err)
                }
                else {
                    res.send({ message: 'data deleted success' })
                }
            })
        }
    })
})


adminExpApp.put('/update', (req, res) => {
    dbo.collection('collection1').findOne({ imsid: req.body.imsid }, (err, result1) => {
        if (err) {
            console.log('err in find', err)
        }
        else if (result1 == null) {
            res.send({ message: 'no data found to edit' })
        }
        else {
            dbo.collection('collection1').updateOne({ imsid: req.body.imsid }, {
                $set: {
                    batch: req.body.batch, firstname: req.body.firstname, Lastname: req.body.Lastname, email: req.body.email,
                    phone: req.body.phone, DOB: req.body.DOB, Qualification: req.body.Qualification, address: req.body.address,
                    Gender: req.body.Gender, Gender: req.body.Gender, angular: req.body.angular,
                    nodejs: req.body.nodejs, python: req.body.python
                }
            },
                (err, done1) => {
                    if (err) {
                        console.log('err in update', err)
                    }
                    else {
                        res.send({ message: 'data updated success' })
                    }
                })
        }
    })
})


//batch related req handlers

adminExpApp.post('/addbatch', (req, res) => {
    dbo.collection('collection2').findOne({ batchno: req.body.batchno }, (err, btchObj) => {
        if (err) {
            console.log('err in find', err)
        }
        else if (btchObj == null) {
            dbo.collection('collection2').insertOne(req.body, (err, resl) => {
                if (err) {
                    console.log('err in insert', err)
                }
                else {
                    res.send({ message: 'batch added' })
                }
            })
        }
        else {
            res.send({ message: 'batch alredy existed' })
        }
    })
})


adminExpApp.get('/getAll', (req, res) => {
    dbo.collection('collection2').find().toArray((err, batchArray) => {
        if (err) {
            console.log('err in find', err)
        }
        else if (batchArray.length == 0) {
            res.send({ message: 'no batches found' })
        }
        else {
            res.send({ message: batchArray })
        }
    })
})


adminExpApp.delete('/removebth/:bno', (req, res) => {
    //console.log(req.params)
    var bn = (req.params.bno)
    dbo.collection('collection2').deleteOne({ batchno: bn }, (err, resul) => {
        if (err) {
            console.log('err in find', err)
        }
        else if (resul == null) {
            res.send({ message: 'no batch details found' })
        }
        else {
            res.send({ message: 'batch removed' })
        }
    })
})


//multers disk storage settings
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, `${new Date().getTime()}_${file.originalname}`)
    }
});


// upload middleware
const upload = multer({ storage: storage });



// convert excel to json route

//upload related post handler

adminExpApp.post("/uploadattendence", upload.single('file'), (req, res) => {
    //console.log(req.file)
    if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
        exceltojson = xlsxtojson;
    }
    else {
        exceltojson = xlstojson;
    }
    try {
        exceltojson({
            input: req.file.path, //the same path where we uploaded our file            
            output: null, //since we don't need output.json            
            lowerCaseHeaders: true
        }, (err, result) => {
            //console.log(result);

            if (err) {
                return res.json({ error_code: 1, err_desc: err, data: null });
            }
            else {
                console.log("result is", result);

                dbo.collection('attendence').findOne({ date: result.date }, (err, res2) => {
                    console.log(`array is `, res2)
                    if (err) {
                        console.log('err in find', err)
                    }
                    else if (res2 == null) {

                        dbo.collection("attendence").insertMany(result, (err, data) => {
                            //console.log(data);
                            res.json({ error_code: 0, err_desc: null, data: data["ops"], "message": "Attendence Sheet uploaded successfully" });
                        });
                    }
                    else {
                        res.send({ message: 'file already existed with same date' })
                    }
                })
            }
        });
    }
    catch (e) {
        res.json({ error_code: 1, err_desc: "Corupted excel file" });
    }
});


//getattendence request handler
adminExpApp.get('/getAttendence', (req, res) => {
    dbo.collection('attendence').find().toArray((err, attArray) => {
        if (err) {
            console.log('err in find', err);
        }
        else if (attArray.length == 0) {
            res.send({ message: 'no details found' })
        }
        else {
            res.send({ message: attArray })
        }
    })
})


adminExpApp.put('/updatebch', (req, res) => {
    //console.log(req.body)
    dbo.collection('attendence').findOne({ date: req.body.date, name: req.body.name }, (err, result1) => {
        if (err) {
            console.log('err in find', err)
        }
        else if (result1 == null) {
            res.send({ message: 'no data found to edit' })
        }
        else {
            dbo.collection('attendence').updateOne({ date: req.body.date, name: req.body.name }, {
                $set: { date: req.body.date, name: req.body.name, status: req.body.status }
            }, (err, done1) => {
                if (err) {
                    console.log('err in update', err)
                }
                else {
                    res.send({ message: 'data updated' })
                }
            })
        }
    })
})


//marks

//multers disk storage settings
var storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, `${new Date().getTime()}_${file.originalname}`)
    }
});

// upload middleware
const uploadm = multer({ storage: storage1 });


// convert excel to json route

//upload related post handler

adminExpApp.post("/uploadmarks", uploadm.single('file'), (req, res) => {
    console.log(req.file)
    if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
        exceltojson = xlsxtojson;
    }
    else {
        exceltojson = xlstojson;
    }
    try {
        exceltojson({
            input: req.file.path, //the same path where we uploaded our file            
            output: null, //since we don't need output.json            
            lowerCaseHeaders: true
        }, (err, result) => {
            //console.log(result);

            if (err) {
                return res.json({ error_code: 1, err_desc: err, data: null });
            }
            else {
                dbo.collection('marks').findOne({ date: result.date }, (err, res2) => {
                    if (err) {
                        console.log('err in find', err)
                    }
                    else if (res2 == null) {

                        dbo.collection("marks").insertMany(result, (err, data) => {
                            //console.log(data);
                            res.json({ error_code: 0, err_desc: null, data: data["ops"], "message": "marks file uploaded" });
                        });
                    }
                    else {
                        res.send({ message: 'file already existed with same date' })
                    }
                })
            }
        });
    }
    catch (e) {
        res.json({ error_code: 1, err_desc: "Corupted excel file" });
    }
});

//getmarks request handler
adminExpApp.get('/bthmarks', (req, res) => {
    dbo.collection('marks').find().toArray((err, marksArray) => {
        if (err) {
            console.log('err in find', err);
        }
        else if (marksArray.length == 0) {
            res.send({ message: 'no details found' })
        }
        else {
            res.send({ message: marksArray })
        }
    })
})



//fees req handler

adminExpApp.post('/addfees', (req, res) => {
    dbo.collection('collection1').findOne({ imsid: req.body.imsid }, (err, feeObj) => {
        if (err) {
            console.log(err)
        }
        else if (feeObj == null) {
            res.send({ message: 'no student found' })
        }
        else {
            if (req.body.balance == null) {
                req.body.balance = req.body.payment-req.body.totalfee
                dbo.collection('fees').insertOne(req.body, (err, feesobj) => {
                    if (err) {
                        console.log('err in insert', err)
                    }
                    else {
                        res.send({ message: 'details added'})
                    }
                })
                dbo.collection('recentlist').insertOne(req.body, (err, list) => {
                    if (err) {
                        console.log('err in insert', err)
                    }
                })
            }
            else {
                req.body.balance = req.body.balance + req.body.payment
                dbo.collection('recentlist').insertOne(req.body, (err, feesobj) => {
                    if (err) {
                        console.log('err in insert', err)
                    }
                    else {
                        res.send({ message: 'details added' })
                    }
                })
            }
        }
    })
})


adminExpApp.get('/getfees', (req, res) => {
    dbo.collection('fees').find().toArray((err, feesArray) => {
        if (err) {
            console.log('err in find', err);
        }
        else if (feesArray.length == 0) {
            res.send({ message: 'no details found' })
        }
        else {
            res.send({ message: feesArray })
        }
    })
})


adminExpApp.get('/getfeelist/:id', (req, res) => {
    dbo.collection('recentlist').find({ imsid: req.params.id }).toArray((err, listArray) => {
        if (err) {
            console.log('err in find', err);
        }
        else if (listArray.length == 0) {
            res.status(404).send({ message: 'no details found' })
        }
        else {
            res.status(200).send({ message: listArray })
        }
    })
})

adminExpApp.delete('/removefeedetls/:bno', (req, res) => {
    var bn = (req.params.bno)
    dbo.collection('fees').deleteOne({ imsid: bn }, (err, resul) => {
        if (err) {
            console.log('err in find', err)
        }
        else if (resul == null) {
            res.send({ message: 'no batch details found' })
        }
        else {
            res.send({ message: 'data cleared' })
        }
    })
})
