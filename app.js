var http = require('http');
var fs = require('fs');
var qs = require('querystring');

const MongoClient = require('mongodb').MongoClient;
const m_url = "mongodb+srv://smody02:Anika32123212@realmcluster.hxqdh.mongodb.net/companies?retryWrites=true&w=majority";

  MongoClient.connect(m_url, { useUnifiedTopology: true }, function(err, db) {
  if(err) { return console.log(err); return;}

var port = process.env.PORT || 3000;
  http.createServer(function (req, res) {
    if (req.url == "/")
    {
      file = 'index.html';
      fs.readFile(file, function(err, txt) {
        res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(txt);
          res.end();
      });
    }
    else if (req.url == "/process")
    {
     res.writeHead(200, {'Content-Type':'text/html'});
     pdata = "";
     req.on('data', data => {
           pdata += data.toString();
         });

    // when complete POST data is received
    req.on('end', () => {
      pdata = qs.parse(pdata);
      // res.write ("The name is: "+ pdata['the_name'] + "<br>");
      // res.write (" and the selection is: " + pdata['sam']);
      var dbo = db.db("companies");
//figure out how to do length
      if (pdata['sam'] == "name"){
          // res.write(" <br> Name = Secured!! <br>")

          var query = {"name":pdata['the_name']};
          var filter = {projection: {"name": 1, "ticker": 1, "_id":0}};
        	dbo.collection('names').find(query, filter).toArray(function(err, result) {
            if (err){
              res.write("Please input a valid company name!");
              throw err;
            }
            console.log(result);
            for (i = 0; i < result.length; i++){
              res.write("The stock tiker for " + result[i]["name"] + " is " + result[i]["ticker"]);
            }
            db.close();
            res.end();

          });


      }else{
        // res.write(" <br> Ticker = Secured!! <br>")
        var upper  = pdata['the_name'].toUpperCase();
        var query = {"ticker":upper};
        var filter = {projection: {"name": 1, "ticker": 1, "_id":0}};
        dbo.collection('names').find(query, filter).toArray(function(err, result) {
          if (err){
            res.write("Please input a valid stock ticker!");
            throw err;
          }
          console.log(result);
          res.write("The company name(s) corresponding to " + result[0]["ticker"] + ": <br>");
          var i;
            for (i = 0; i < result.length; i++){
              res.write(result[i]["name"] + "<br>");
          }

          db.close();
          res.end();


        });
      }
//ADD IF STATEMENTS

      // var query = {"ticker":"ATVI"};
      // var filter = {projection: {"name": 1, "ticker": 1, "_id":0}};
    	// dbo.collection('names').find(query, filter).toArray(function(err, result) {
      //   if (err) throw err;
      //   console.log(result);
      //
      //
      //   res.write("<br> !!!!!! " + result[0]["name"]);
      //
      //
      //
      //
      //
        // db.close();
        // res.end();
      // });

      // res.write(result[0]["name"]);
      // res.end();
    });
    }
    else{
      res.writeHead(200, {'Content-Type':'text/html'});
      res.write ("Unknown page request");
    }
  }).listen(port);



  // var dbo = db.db("companies");
  // var query = {"ticker":"ATVI"};
  // var filter = {projection: {"name": 1, "ticker": 1, "_id":0}};
	// dbo.collection('names').find(query, filter).toArray(function(err, result) {
  //   if (err) throw err;
  //   console.log(result);
  //
  //
  //   db.close();
  // });
});



// res.writeHead(200, {'Content-Type': 'text/html'});
// res.write(result[0]["name"]);
// res.end();
