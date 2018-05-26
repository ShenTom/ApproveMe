
const nextSeqVal = function (sequenceName){
  
  var MongoClient = require('mongodb').MongoClient;
  
  MongoClient.connect(process.env.DB_LOGIN, (err, db) => { 
    if (err) {
      console.log("SeqVal db error: ", err);
      return;
    }
    
    var sequenceDocument = db.counters.findAndModify({
      query:{_id: sequenceName },
      update: {$inc:{sequence_value:1}},
      new:true
    });

    return sequenceDocument.sequence_value;
  
  })
}

module.exports = nextSeqVal;
