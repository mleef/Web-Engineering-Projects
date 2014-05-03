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

  var poker_hands = {"1kind" : 1, "pair" : 2, "2pair" : 3, "3kind" : 4, "straight" : 5, "flush" : 6, "fullhouse" : 7, "4kind" : 8, "straightflush" : 9};  //lowest to highest




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

  var slim_hand=[];

  var annie_hand=[];

  var pete_hand=[];

  var the_deal = [ {"person": slim, "hand": slim_hand, "counts": null, "value": null, "place": 0},   //e.g., counts = {"two": 3, "five": 1, "jack": 1}
                   {"person": annie, "hand": annie_hand, "counts": null, "value": null, "place": 0}, //e.g., place = 1,2,3. Ties have same number.
                   {"person": pete, "hand": pete_hand, "counts": null, "value": null, "place": 0}     //e.g., value = 1kind, pair, straight, etc.
                  ];


  function computeCounts(){
    the_deal.forEach( function (player){
                            var ranks = player.hand.map( function (card_obj) {
                                               return card_obj.rank;});                                   //e.g., ["two", "king", "nine", ...]
                            var counts = ranks.reduce( function (count_obj, rank) {
                                                          if( rank in count_obj) count_obj[rank]++; else count_obj[rank] = 1; return count_obj}, {});
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

    if(exactlyK(counts,3).length == 1 && exactlyK(counts,2).length == 1) {
      return true;
    }

    else {
      return false;
    }

    //return true if player holds full-house
  }

  function isStraight( player ){
      var counts = player.counts; //e.g. {"two": 1, "ace": 3, "nine": 1}
      if("ace" in counts) {
        var ind =  Object.keys(counts).indexOf("ace");
        var temp = Object.keys(counts);
        temp.splice(ind, 1);
        if(rank_to_number[largestRank(temp)] - rank_to_number[smallestRank(temp)] == 3 && exactlyK(counts, 1).length == 5) {
          return true;
        } 
        return false;
      }

      else {
        if(rank_to_number[largestRank(Object.keys(counts))] - rank_to_number[smallestRank(Object.keys(counts))] == 4 && exactlyK(counts, 1).length == 5) {
          return true;
        }
        return false;
      }
      
      //return true for both normal straight and special ace-low straight
  }

  function isFlush( player ){
      //return true if all suits the same
      var suits = player.hand.map( function (card_obj) {
                                               return card_obj.suit;});
      var first = suits[0];
      return suits.every( function(suit) {
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

    var values = [];
    var tie = new Boolean();
    var resultList = [];
    tie = false; 
    var p1;
    var p2;
    var p3;

    var count = 0;

    the_deal.forEach( function (player){
      values.push({"name" : player.person.handle, "value" : poker_hands[player.value]});
      if(count == 0) {
        p1 = {"name" : player.person.handle, "hand" : player.counts, "value" : poker_hands[player.value] };
      }
      else if(count == 1) {
        p2 = {"name" : player.person.handle, "hand" : player.counts, "value" : poker_hands[player.value] };
      }
      else {
        p3 = {"name" : player.person.handle, "hand" : player.counts, "value" : poker_hands[player.value] };
      }
      count += 1;
    })

    values.sort(function(a, b){
      return a.value-b.value
    })

    var first = values.pop();
    var second = values.pop();
    var third = values.pop();

    if(first.value == second.value || first.value == third.value || second.value == third.value) {
      tie = true;
    }

    tieList = {"names" : [], "place" : 0};
    console.log(p1.name);
    console.log(p2.name);
    console.log(p3.name);
    if(tie) {
      console.log("TIE SITUATION");
      var winner = kickerSequence(p1, p2);
      if(winner == "tie") {
        var winner2 = kickerSequence(p1, p3);
        if(winner2.name == p1.name) {
          console.log("1");
          first.name = p1.name;
          second.name = p2.name;
          tieList.names[p1.name] = 1;
          tieList.names[p2.name] = 1;
          tieList.place = 1;
        }
        else if(winner2.name == p3.name) {
          console.log("2");
          first.name = p3.name;
          second.name = p1.name;
          tieList.names[p2.name] = 1;
          tieList.names[p1.name] = 1;
          tieList.place = 2;
        }

        else {
          console.log("3");
          tieList.names[p1.name] = 1;
          tieList.names[p2.name] = 1;
          tieList.names[p3.name] = 1;
          tieList.place = 1;
        }
      }

      else {
        var winner2 = kickerSequence(winner, p3);
        if(winner2 == "tie") {
          if(winner.name == p1.name) {
            console.log("4");
            first.name = winner.name;
            second.name = p3.name;
            tieList.names[winner.name] = 1;
            tieList.names[p3.name] = 1;
            tieList.place = 1;
          }
          else if(winner.name == p2.name) {
            console.log("5");
            first.name = p2.name;
            second.name = p3.name;
            tieList.names[p2.name] = 1;
            tieList.names[p3.name] = 1;
            tieList.place = 1;
          }

          else {
            console.log("6");
            tieList.names[p1.name] = 1;
            tieList.names[p2.name] = 1;
            tieList.names[p3.name] = 1;
            tieList.place = 1;
          }
        }

        else {
          console.log(winner);
          console.log(winner2);
          if(winner.name == winner2.name) {
            first.name = winner.name;
            if(winner.name == p1.name) {
              console.log("7");
              winner2 = kickerSequence(p2, p3);
              if(winner2 == "tie") {  
                tieList.names[p2.name] = 1;
                tieList.names[p3.name] = 1;
                tieList.place = 2;
              }
              else {
                second.name = winner2.name
              }
              
            }
            else {
              console.log("8");
              winner2 = kickerSequence(p1, p3);
              if(winner2 == "tie") {
                tieList.names[p1.name] = 1;
                tieList.names[p3.name] = 1;
                tieList.place = 2;
              }
              else {
                second.name = winner2.name;
              }
              
            }
        }

          else {
            console.log("9");
            first.name = p3.name;
            second.name = winner.name;
          } 
        }

      }
    }


    else { 
      var winner = kickerSequence(p1, p2);
      var winner2 = kickerSequence(winner, p3);
      if(winner.name == winner2.name) {
        first.name = winner.name;
        if(winner.name == p1.name) {
          winner2 = kickerSequence(p2, p3);
          second.name = winner2.name
          console.log("10");
        }
        else {
          winner2 = kickerSequence(p1, p3);
          second.name = winner2.name;
          console.log("11");
        }
      }

      else {
        first.name = p3.name;
        second.name = winner.name;
        console.log("12");
      }
    }

    console.log("First: " + first.name);
    console.log("Second: " + second.name);
    console.log(tieList.names);
    console.log(tieList.place);
    setPlaces(first.name, second.name, third.name , tieList.names, tieList.place);
  


    //use values of players' hands to figure out their placement (1,2,3)
    //Tricky part is ties on hand value, e.g., slim and pete both have 1kind.
    //Then have to invoke tie-breaker rules (see top of file). Challenging problem!
    }


  function kickerSequence(p1, p2){

    if(p1.value > p2.value) {
      return p1;
    }
    else if(p1.value < p2.value) {
      return p2;
    }

    else {

      switch(p1.value) {

        case 1:
          console.log("1kind tie");
          return kick(p1, p2);
          break;


        case 2:
          console.log("pair tie");
          if(rank_to_number[exactlyK(p1.hand, 2)[0]] > rank_to_number[exactlyK(p2.hand, 2)[0]]) {
              return p1;
            }
          else if(rank_to_number[exactlyK(p1.hand, 2)[0]] < rank_to_number[exactlyK(p2.hand, 2)[0]]) {
              return p2;
            }
          return kick(p1, p2);
          break;

        case 3:
          console.log("2pair tie");
          var h1 = Math.max(rank_to_number[exactlyK(p1.hand, 2)[0]], rank_to_number[exactlyK(p1.hand, 2)[1]]);
          var h2 = Math.max(rank_to_number[exactlyK(p2.hand, 2)[0]], rank_to_number[exactlyK(p2.hand, 2)[1]]);

          if(h1 > h2) {
            return p1;
          }
          else if(h1 < h2) {
            return p2;
          }
          else {
            if(rank_to_number[largestRank(exactlyK(p1.hand, 1))] > rank_to_number[largestRank(exactlyK(p2.hand, 1))]) {
              return p1;
            }

            else if (rank_to_number[largestRank(exactlyK(p1.hand, 1))] < rank_to_number[largestRank(exactlyK(p2.hand, 1))]) {
              return p2;
            }

            return "tie";
          }

          break;

        case 4:
          console.log("3kind tie");
          if(rank_to_number[exactlyK(p1.hand, 3)[0]] > rank_to_number[exactlyK(p2.hand, 3)[0]]) {
              return p1;
            }
          else if(rank_to_number[exactlyK(p1.hand, 3)[0]] < rank_to_number[exactlyK(p2.hand, 3)[0]]) {
              return p2;
            }
          return kick(p1, p2);
          break;

        case 5:
          console.log("straight tie");
          return kick(p1, p2);
          break;

        case 6:
          console.log("flush tie");
          return kick(p1, p2);
          break;

        case 7:
          console.log("full house tie");
          if(rank_to_number[exactlyK(p1.hand, 3)[0]] > rank_to_number[exactlyK(p2.hand, 3)[0]]) {
              return p1;
          }
          else if(rank_to_number[exactlyK(p1.hand, 3)[0]] < rank_to_number[exactlyK(p2.hand, 3)[0]]) {
              return p2;
          }
          else if(rank_to_number[exactlyK(p1.hand, 2)[0]] > rank_to_number[exactlyK(p2.hand, 2)[0]]) {
              return p1;
          }
          else if(rank_to_number[exactlyK(p1.hand, 2)[0]] < rank_to_number[exactlyK(p2.hand, 2)[0]]) {
              return p2;
          }
          else {
              return "tie";
          }
          break;

        case 8:
          console.log("4kind tie");
          if(rank_to_number[exactlyK(p1.hand, 4)[0]] > rank_to_number[exactlyK(p2.hand, 4)[0]]) {
              return p1;
          }
          else if(rank_to_number[exactlyK(p1.hand, 4)[0]] < rank_to_number[exactlyK(p2.hand, 4)[0]]) {
              return p2;
          }
          else if(rank_to_number[largestRank(exactlyK(p1.hand, 1))] > rank_to_number[largestRank(exactlyK(p2.hand, 1))]) {
            return p1;
          }
          else if (rank_to_number[largestRank(exactlyK(p1.hand, 1))] < rank_to_number[largestRank(exactlyK(p2.hand, 1))]) {
            return p2;
          }
          else {
            return "tie";
          }
          break;

        case 9:
          console.log("straight flush tie");
          return kick(p1, p2);
          break;

        }


    }










  }


  function kick(p1, p2) {

    var a = exactlyK(p1.hand, 1);
    var b = exactlyK(p2.hand, 1);
    var running = true;
    var ind1, ind2;
    var l1, l2;
    while(a.length > 0 && b.length > 0) {
      l1 = largestRank(a);
      l2 = largestRank(b);

      ind1 = a.indexOf(l1);
      ind2 = b.indexOf(l2);

      if(rank_to_number[l1] > rank_to_number[l2]) {
        return p1;
      }

      if(rank_to_number[l1] < rank_to_number[l2]) {
        return p2;
      }

      a.splice(ind1, 1);
      b.splice(ind2, 1)

    } 
    return "tie";


  }

  function setPlaces(first, second, third, list, place) {

      if(place != 0) {
        the_deal.forEach( function (player){
          if(list[player.person.handle]) {
            player.place = place;
          }

          else {
            if(place == 1) {
              player.place = 2;
            }
            else {
              player.place = 1;
            }
          }

        })


      }
      else {
        the_deal.forEach( function (player){
          if(player.person.handle == first) {
            player.place = 1;
          }

          else if(player.person.handle == second) {
            player.place = 2;
          }

          else {
            player.place = 3;
          }
        })
      }




  }




