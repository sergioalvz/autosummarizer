$(document).ready(function() {

	$("#btSummarize").click(function() {
		//Cleaning the results
		$("#results ul").empty();
		
		var text = $("#source").val();
		var summarize = new AutomaticSummarizer();
		var sentences = summarize.summarize(text);		

		for(var i = 0; i < sentences.length; i++){
			var sentence = sentences[i];
			$("#results ul").append("<li>" + sentence.sentence + " - " + sentence.weight + "</li>");
		}		
	});
});

/* ***************************************** */
/*              AUTOMATICSUMMARIZER          */
/* ***************************************** */
function AutomaticSummarizer() {

	/* ************************************ */
	/*           PRIVATE FUNCTIONS          */			
	/* ************************************ */
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
	
	this.obtainSentencesWeights = function(sentences, weights){
		var result = new Array();
		for(var i = 0; i < sentences.length; i++){
			var sentence = sentences[i];
			var innerWords = this.itemize(sentence);
			if(innerWords != null){		
				var value = 0;				
				for(var j = 0; j < innerWords.length; j++){
					value += weights[innerWords[j]];
				}				
				var sentenceWeight = new Object();
				sentenceWeight.sentence = sentence;
				sentenceWeight.weight = value;
				
				result.push(sentenceWeight);
			}
		}
		
		return result;
	};

}

AutomaticSummarizer.prototype = {
	summarize : function(text) {
		var words = this.itemize(text);
		var weights = this.pageRank(words);
		var sentences = this.obtainSentencesWeights(text.split('.'), weights);	

		return sentences;
	}
};
