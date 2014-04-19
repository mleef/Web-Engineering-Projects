var main = function() {
				$(".tabs button").on("click", function(event) {
					var bid = event.currentTarget.id; 
					selectTab(bid);
				});
			}

			var selectTab = function(bid) {
				$(".tabs button span").removeClass("active");
				$("button#" + bid + " span").addClass("active");

				$(".triad").addClass("hidden");
				$("div." + bid).removeClass("hidden");

			}	

$("document").ready(main);