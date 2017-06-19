var amazon = require('amazon-product-api');

var client = amazon.createClient({
  awsId: "",
  awsSecret: ""
});

let asin = "B0052OSNGM";


client.itemLookup({
  itemId: asin,
  responseGroup: 'ItemAttributes'
}, function(err, results, response) {
  if (results) {
    //console.log(results);

    console.log(results[0].ItemAttributes[0]);


    //console.log(results[0].ItemAttributes[0]["Title"][0]);
    //console.log(results[0].ItemAttributes[0]["ProductGroup"][0]);
    //console.log(results[0].ItemAttributes[0]["EAN"][0]);

  } else {
    console.log(err.Error);
  }
});




//Recherche des élements correspondant
/*
client.itemSearch({
  keywords : 'HarryPotter',
  searchIndex: 'DVD',
  audienceRating: 'R',
  responseGroup: 'ItemAttributes'
}).then(function(results){
  console.log(JSON.stringify(results));
}).catch(function(err){
  console.log(JSON.stringify(err));
});
*/

/*
client.itemSearch({
  director: 'Quentin Tarantino',
  actor: 'Samuel L. Jackson',
  searchIndex: 'DVD',
  audienceRating: 'R',
  responseGroup: 'ItemAttributes,Images'
}).then(function(results){
  console.log(results);
}).catch(function(err){
  console.log(err.Error);
});
*/


//Recherche via code ASIN
/*client.itemLookup({
  itemId: 'B00CGVSP44'
  ,responseGroup: 'ItemAttributes'
}, function(err, results, response) {
  if (err) {
    console.log(JSON.stringify(err));
  } else {
    console.log(JSON.stringify(results));
  }
});
*/


//Recherche un livre via numéro ISBN
/*
client.itemLookup({
  idType: 'ISBN',
  itemId: '9782253161677',
  //searchIndex: 'Books',
  responseGroup: 'ItemAttributes,Images'
}, function(err, results, response) {
  if (err) {
    console.log(JSON.stringify(err));
  } else {
    console.log(JSON.stringify(results));
  }
});
*/
