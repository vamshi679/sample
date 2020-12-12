
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
        // console.log('connected to database')
    }
})



// middleware
var stdId = (req, res, next) => {
    console.log("middleware is workining")
    dbo.collection("idscoln").updateOne({ name: 'IMSuser' }, { $inc: { number: 1 } }, (err, result) => {
        if (err) {
            console.log("error in reading data", err)
        }
        else {
            dbo.collection("idscoln").find().toArray((err, dataArray) => {
                if (err) {
                    console.log('err in find')
                }
                else {
                    // console.log(dataArray);
                    req.body.imsid = dataArray[0].name + dataArray[0].number;
                    next();
                }
            })
        }
    })

}

// exporting generateid module
module.exports = stdId

