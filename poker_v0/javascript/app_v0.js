/**
    Pairs - When two players have a pair, the highest pair wins.
    When both players have the same pair, the next highest card wins.
    This card is called the 'Kicker'.   For example, 5-5-J-7-4 beats 5-5-9-8-7.
    If the Pairs and the Kickers are the same, the consideration continues onward
    to the next highest card in the hand.   5-5-J-6-4 beats 5-5-J-5-3.   This evaluation
    process continues until both hands are exactly the same or there is a winner.

    Two Pairs - the higher ranked pair wins.   A-A-7-7-3 beats K-K-J-J-9.   If the top pairs
    are equal, the second pair breaks the tie.   If both the top pair and the second pair are
    equal, the kicker (the next highest card) breaks the tie.

    Three-of-a-Kind - the higher ranking card wins.   J-J-J-7-6 beats 10-10-10-8-7.

    Straights - the Straight with the highest ranking card wins.   A-K-Q-J-10 beats 10-9-8-7-6,
    as the A beats the 10.   If both Straights contain cards of the same rank, the pot is split.

    Flush - the Flush with the highest ranking card wins.   A-9-8-7-5 beats K-Q-J-5-4.   If
    the highest cards in each Flush are the same, the next highest cards are compared.   This
    process continues until either the hands are shown to be exactly the same, or there is a winner.

    Full House - the hand with the higher ranking set of three cards wins.   K-K-K-4-4 beats J-J-J-A-A.

    Four of a Kind - the higher ranked set of four cards wins.   7-7-7-7-2 beats 5-5-5-5-A.

    Straight Flush - ties are broken in the same manner as a straight, as the highest ranking card is the winner.

    Royal Flush - Sorry, Two or more Royal Flushes split the pot.
**/

var poker_hands = ["1kind", "pair", "2pair", "3kind", "straight", "flush", "fullhouse", "4kind", "straightflush"];  //lowest to highest

var rank_to_number = {
         "two":    1,
         "three":  2,
         "four":   3,
         "five":   4,
         "six":    5,
         "seven":  6,
         "eight":  7,
         "nine":   8,
         "ten":    9,
         "jack":  10,
         "queen": 11,
         "king":  12,
         "ace":   13   //special case - can be used as low for straight
  };

var slim = {"handle": "slim",
            "bluffer": true,
            "winnings": 0};

var annie = {"handle": "annie",
             "bluffer": true,
             "winnings": 0};

var pete = {"handle": "pete",
            "bluffer": false,
            "winnings": 0};

var slim_hand=[
  { "rank":"two", "suit":"spades" },
  { "rank":"four", "suit":"hearts" },
  { "rank":"two", "suit":"clubs" },
  { "rank":"king", "suit":"spades" },
  { "rank":"eight", "suit":"diamonds"}
];

var annie_hand=[
  { "rank":"two", "suit":"hearts" },
  { "rank":"four", "suit":"clubs" },
  { "rank":"two", "suit":"spades" },
  { "rank":"king", "suit":"hearts" },
  { "rank":"eight", "suit":"spades" }
];

var pete_hand=[
  { "rank":"two", "suit":"diamonds" },
  { "rank":"six", "suit":"spades" },
  { "rank":"two", "suit":"spades" },
  { "rank":"nine", "suit":"spades" },
  { "rank":"nine", "suit":"spades" }
];

var the_deal = [ {"person": slim, "hand": slim_hand, "counts": null, "value": null, "place": 0},   //e.g., counts = {"two": 3, "five": 1, "jack": 1}
                 {"person": annie, "hand": annie_hand, "counts": null, "value": null, "place": 0}, //e.g., place = 1,2,3. Ties have same number.
                 {"person": pete, "hand": pete_hand, "counts": null, "value": null, "place": 0}     //e.g., value = 1kind, pair, straight, etc.
                ];


function computeCounts(){
  the_deal.forEach( function (player){
                          var ranks = player.hand.map( function (card_obj) {
                                             return card_obj.rank;});                                   //e.g., ["two", "king", "nine", ...]
                          var counts = ranks.reduce( function (count_obj, rank) {
                                                        if( rank in count_obj) count_obj[rank]++; else count_obj[rank] = 1;}, {});
                          player.counts = counts;                        //e.g., counts = {"two": 3, "five": 1, "jack": 1}
  });
}

//e.g., rank_array = ["two", "king", "nine", ...]
function largestRank( rank_array ){
      //return largest rank in array, e.g., "king"
      return rank_array.reduce( function (high, cur){
            if(rank_to_number[cur] > rank_to_number[high]) return cur; else return high;  
      }, "two" );
}

function smallestRank( rank_array ){
        return rank_array.reduce( function (low, cur){
            if(rank_to_number[cur] < rank_to_number[low]) return cur; else return low;  
      }, "ace" );
}

//e.g., counter_obj = {"two": 1, "ace": 3, "nine": 1}, k = 3 => ["ace"]. if k = 2 => []. k = 1 => ["two", "nine"]
function exactlyK( counter_obj, k ){

        return Object.keys(counter_obj).filter( function (rank) { 
              return counter_obj[rank] == k;
        });
  //return array of ranks that appear k times in hand

}


function computeGroup( player ){
  var counts = player.counts; //e.g. {"two": 1, "ace": 3, "nine": 1}

  if(isStraightFlush(player)) {
    return "straightflush";
  }

  else if(exactlyK(counts, 4).length == 1) {
    return "4kind";
  }

  else if(isFullHouse(player)) {
    return "fullhouse";
  }

  else if(isFlush(player)) {
    return "flush";
  }

  else if(isStraight(player)) {
    return "straight";
  }

  else if(exactlyK(counts, 3).length == 1) {
    return "3kind";
  }

  else if(exactlyK(counts, 2).length == 2) {
    return "2pair";
  }

  else if(exactlyK(counts, 2).length == 1) {
    return "pair";
  }

  else if(exactlyK(counts, 1).length > 0) {
    return "1kind";
  }


  //return 4kind, 3kind, 2pair, pair, 1kind as appropriate (always highest possible)

}

function isFullHouse( player ){
  var counts = player.counts; //e.g. {"two": 1, "ace": 3, "nine": 1}
  return exactlyK(player,3).length == 1 && exactlyK(player, 2) == 1;
  //return true if player holds full-house
}

function isStraight( player ){
    var counts = player.counts; //e.g. {"two": 1, "ace": 3, "nine": 1}
    return largestRank(Object.keys(counts)) - smallestRank(Object.keys(counts)) == 4;
    //return true for both normal straight and special ace-low straight
}

function isFlush( player ){
    //return true if all suits the same
    var suits = player.hand.map( function (card_obj) {
                                             return card_obj.suit;});
    var first = suits[0];
    return ranks.every( function(suit) {
          return suit == first;
    });            
}

function isStraightFlush( player ){

    return isFlush(player) && isStraight(player);
    //do the obvious
}


function computeValues(){
  the_deal.forEach( function (player){
    player.value = computeGroup(player);
  })

    //for each player, compute value of hand and then fill in player.value
}

function computePlaces(){

  values = [];

  the_deal.forEach( function (player){
    values[poker_hands[player.value]] = player.person;
  })

  values = values.sort;

  var first = values[0];
  var second = values[1];
  var third = values[2];

  the_deal.forEach( function (player){
    if(player.person == first) {
      player.place = 1;
    }

    else if(player.person == second) {
      player.place = 2;
    }

    else if(player.person == third) {
      player.place = 3;
    }
    
  })






  //use values of players' hands to figure out their placement (1,2,3)
  //Tricky part is ties on hand value, e.g., slim and pete both have 1kind.
  //Then have to invoke tie-breaker rules (see top of file). Challenging problem!
  }

function kickerSequence( player1, player2 ){
    //for 1kind and flush ties, sort ranks and compare one by one.
    //return winning player or null if true tie
}


