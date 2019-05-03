// const MongoClient = require('mongodb').MongoClient;
//
// // replace with your uri string here
// const uri='mongodb+srv://admin:admin123@cluster0-loeak.mongodb.net/test?retryWrites=true';
//
// MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
//   if (err) {
//     return console.log(err);
//   }
//
//   // insert one new message here
//   client.db("test").collection('unicorns').insertOne({
//     name: "Corny"
//   }),
//
//   client.db("test").collection("unicorns").find({ name: "Corny" }).toArray().then((docs) => {
//     console.log(JSON.stringify(docs, undefined, 2));
//   },(err, res) => {
//     if (err) {
//       client.db("test").close();
//       return console.log(err);
//     }
//     // if success, then close
//     client.close();
//   });
// });
//
// module.exports = {MongoClient};
