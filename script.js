var DB = {};
var SUB = {};
var WORD_LIST = [];
var searchBox = $("#search-input");
var resultList = $("#result-list");

var SUGGESTION_HTML = "<li class='list-group-item clearfix'>"+
                        "<h4>%s<span class='pull-right'>စာမျက်နှာ %s</span></h4>"+
                        "<hr>"+
                        "<p>%s</p>"+
                        "</li>";
var SPLITER = "<span class='fa fa-angle-right'></span>";

// Build DataBase

function findRoot(root, rootOfroot){
  var pg, ix, i = 0;
  for(var key in root){
    if(typeof root[key] === "string"){
      DB[key] = {
        page: root[key],
        indexAt: rootOfroot || ""
      };
      WORD_LIST.push(key);
    } else if( (pg = root[key].page) ){
      ix = root[key].indexs;
      DB[key] = {
        page: pg,
        indexAt: rootOfroot || "",
        include: ix
      };
      WORD_LIST.push(key);
      for(; i < ix.length; i++){
        SUB[ix[i]] = {
          ref: key
        };
        WORD_LIST.push(ix[i]);
      }
    } else {
      findRoot(
        root[key], key+","
      );
    }
  }
}


findRoot(PDB);
function clearSuggestion(){
  resultList.html("");
}
function addToSuggestion(word){
  var html = SUGGESTION_HTML;
  var db;
  if( (db = DB[word]) ){
    html = html.replace('%s', "<strong>"+word+"</strong>");
    html = html.replace('%s', db.page);
    html = html.replace('%s', db.indexAt.replace(",", SPLITER, "g") + word);
    resultList[0].innerHTML += html;
  } else if( SUB[word] ){
    db = DB[SUB[word]];
    html = html.replace('%s', "<strong>"+word+"</strong>");
    html = html.replace('%s', db.page);
    html = html.replace('%s', db.indexAt.replace(",", SPLITER, "g") + word);
    resultList[0].innerHTML += html;
  }
}

function wordFinder(word, limit){
  var _res = [],
      i = 0, j = 0;
  var rex = new RegExp(word, "g");
  var Smatch = new RegExp("^"+word);
  if(word.length > 0){
    for(; i < WORD_LIST.length; i++){
      if(WORD_LIST[i].match(Smatch)){
        _res.push(WORD_LIST[i]);
      }
    } 
  }
  return _res;
}

searchBox.keyup(function(){
  clearSuggestion();
  var wordsList = wordFinder(searchBox.val().trim());
  var limit = wordsList.length < 10? wordsList.length: 10;
  for(var i = 0; i < limit; i++){
    addToSuggestion(wordsList[i]);
  }
});


console.log(DB.class);