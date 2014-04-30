//global list for keeping track of votes
var voteList = new Array();

//function for incrementing vote counts, sets to 1 if input is a new name
var addVote = function (name) {
  if(!voteList[name]) {
    voteList[name] = 1;
    return {"message" : "The name "+ name + " now has 1 vote."};
  }
  else {
    voteList[name] = voteList[name] + 1;
    return {"message" : "The name "+ name + " now has " + voteList[name] + " votes."};
  }
}


module.exports = {
  "addVote": addVote
};