//global list for keeping track of votes
var voteList = new Array();

//function for incrementing vote counts, sets to 1 if input is a new name
var addVote = function (name) {
  if(!voteList[name]) {
    voteList[name] = 1;
    return {"message" : "The name "+ name + " now has 1 vote.", "name" : name, "vote" : 1};
  }
  else {
    voteList[name] = voteList[name] + 1;
    return {"message" : "The name "+ name + " now has " + voteList[name] + " votes.", "name" : name, "vote" : voteList[name]};
  }
}


module.exports = {
  "addVote": addVote
};