$(document).ready(function() {

	$('button').click(function() {
		var text = $("textarea").val();
		var summarize = new AutomaticSummarizer();
		var weights = summarize.summarize(text);		

		var words = Object.keys(weights).sort(function(a, b) {
			return weights[a] > weights[b] ? -1 : weights[a] < weights[b] ? 1 : 0;
		});

		$.each(words, function() {
			$('#results ul').append("<li>" + this + " - " + weights[this] + "</li>");
		});
	});
});

/* ***************************************** */
/* ********** AutomaticSummarizer ********** */
/* ***************************************** */
function AutomaticSummarizer() {
	this.itemize = function(text) {
		//Regexp for itemize
		var regex = /([a-zA-Z_ñáéíóú][a-zA-Z_ñáéíóú']*[a-zA-Z_ñáéíóú]|[a-zA-Z_ñáéíóú])/g;
		return text.toLowerCase().match(regex);
	};

	this.pageRank = function(words) {
		var weights = new Object();
		for (var i in words) {
			i = parseInt(i);
			var current = words[i];
			if (i === 0) {
				//if it is the first word
				weights[current] = 1;
			}

			if (i < words.length - 1) {
				//if is not the last word
				var next1 = words[i + 1];
				if (weights[next1]) {
					weights[next1]++;
				} else {
					weights[next1] = 1;
				}
			}

			if (i < words.length - 2) {
				//if it is not the second last
				var next2 = words[i + 1];
				if (weights[next2]) {
					weights[next2]++;
				} else {
					weights[next2] = 1;
				}
			}

			if (i > 0) {
				//if it is not the first word
				var before1 = words[i - 1];
				weights[before1]++;
			}

			if (i > 1) {
				//if it is not the second word
				var before2 = words[i - 2];
				weights[before2]++;
			}
		}
		return weights;
	};

}

AutomaticSummarizer.prototype = {
	summarize : function(text) {
		var words = this.itemize(text);
		var weights = this.pageRank(words);

		return weights;
	}
};
