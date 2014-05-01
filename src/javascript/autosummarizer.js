var salvarezsuar = salvarezsuar || {};
salvarezsuar.AutomaticSummarizer = (function() {
  var stopWords = ["de","la","que","el","en","y","a","los","del","se","las","por","un","para","con","no",
  "una","su","al","es","lo","como","más","pero","sus","le","ya","o","fue","este","ha","sí","si","por que",
  "esta","son","entre","está","cuando","muy","sin","sobre","ser","tiene","también","me","hasta",
  "hay","donde","han","quien","están","estado","desde","todo","nos","durante","estados","todos",
  "uno","les","ni","contra","otros","fueron","ese","eso","había","ante","ellos","e","esto","mí","algunos",
  "qué","unos","yo","otro","otras","otra","él","tanto","esa","estos","mucho","quienes","nada",
  "muchos","cual","sea","poco","ella","estar","haber","estas","estaba","estamos","algunas","algo",
  "nosotros","mi","mis","tú","te","ti","tu","tus","ellas","nosotras","vosotros","vosotras","os","mío","mía",
  "míos","mías","tuyo","tuya","tuyos","tuyas","suyo","suya","suyos","suyas","nuestro","nuestra",
  "nuestros","nuestras","vuestro","vuestra","vuestros","vuestras","esos","esas","estoy","estás","esté",
  "estamos","estéis","están","estemos","estáis","estén","estaré","estarás","estará","estaremos",
  "estaría","estarías","estaríamos","estaríais","estarían","estaba","estabas","estábamos","estabais",
  "estaban","estuve","estuviste","estuvo","estuvimos","estuvisteis","estuvieron","estuviera","estuvieras",
  "estuviéramos","estuvierais","estuvieran","estuviese","estuvieses","estuviésemos","estuvieseis",
  "estuviesen","estando","estado","estada","estados","estadas","estad","he","has","ha","hemos",
  "habéis","han","haya","hayas","hayamos","hayáis","hayan","habrá","habrás","habré","habremos","habréis",
  "habrán","habría","habrías","habríamos","habríais","habrían","había","habías","habíamos","habíais",
  "habían","hube","hubiste","hubo","hubimos","hubisteis","hubieron","hubiera","hubieras","hubiéramos",
  "hubierais","hubieran","hubiese","hubieses","hubiésemos","hubieseis","hubiesen","habiendo",
  "habido","habida","habidos","habidas","soy","eres","es","somos","sois","son","sea","seas","seamos",
  "seáis","sean","seré","serás","será","seremos","seréis","serán","sería","serías","seríamos","seríais",
  "serían","era","eras","éramos","erais","eran","fui","fuiste","fue","fuimos","fuisteis","fueron",
  "fuera","fueras","fuéramos","fuerais","fueran","fuese","fueses","fuésemos","fueseis","fuesen",
  "siendo","sido","tengo","tienes","tiene","tenemos","tenéis","tienen","tenga","tengas","tengamos",
  "tengáis","tengan","tendré","tendrás","tendrá","tendremos","tendráis","tendrán","tendría","tendrías",
  "tendríamos","tendríais","tendrían","tenía","tenías","teníamos","teníais","tenían","tuve","tuviste",
  "tuvo","tuvimos","tuvisteis","tuvieron","tuviera","tuvieras","tuviéramos","tuvierais","tuvieran",
  "tuviese","tuvieses","tuviésemos","tuvieseis","tuviesen","teniendo","tenido","tenida","tenidos",
  "tenidas","tened","i","me","my","myself","we","us","our","ours","ourselves","you","your","yours",
  "yourself","yourselves","he","him","his","himself","she","her","hers","herself","it","its","itself",
  "they","them","their","theirs","themselves","what","which","who","whom","this","that","these",
  "those","am","is","are","was","were","be","been","being","have","has","had","having","do","does",
  "did","doing","will","would","shall","should","can","could","may","might","MUST","must","ought","i'm",
  "you're","he's","she's","it's","we're","they're","i've","you've","we've","they've","i'd","you'd",
  "he'd","she'd","we'd","they'd","i'll","you'll","he'll","she'll","we'll","they'll","isn't","aren't",
  "wasn't","weren't","hasn't","haven't","hadn't","doesn't","don't","didn't","won't","wouldn't",
  "shan't","shouldn't","can't","cannot","couldn't","mustn't","let's","that's","who's","what's","here's",
  "there's","when's","where's","why's","how's","a","an","the","and","but","if","or","because","as",
  "until","while","of","at","by","for","with","about","against","between","into","through","during",
  "before","after","above","below","to","from","up","down","in","out","on","off","over","under","again",
  "further","then","once","here","there","when","where","why","how","all","any","both","each",
  "few","more","most","other","some","such","no","nor","not","only","own","same","so","than","too",
  "very","one","every","least","less","many","now","ever","never","say","says","said","also","get","go",
  "goes","just","made","make","put","see","seen","whether","like","well","back","even","still","way",
  "take","since","another","however","two","three","four","five","first","second","new","old","high","long","t"];

  var itemize = function(text) {
    //Regexp for itemize
    var regex = /([a-zA-Z_ñáéíóú][a-zA-Z_ñáéíóú']*[a-zA-Z_ñáéíóú]|[a-zA-Z_ñáéíóú])/g;
    return text.toLowerCase().match(regex);
  };

  var pageRank = function(words) {
    var results = obtainLinksFromEachWord(words);
    var ranking = obtainRankingFromLinks(results);

    ranking = _.filter(ranking, function(rank) { return !_.contains(stopWords, rank.word); });
    return _.sortBy(ranking, function(rank) { return rank.total; }).reverse();
  };

  var obtainLinksFromEachWord = function(words) {
    var results = {};
    _.each(words, function(word, index){
      var linksTo = index < words.length ? words[index + 1] : null;
      if(linksTo !== null){
        var totals = results[word] || {};
        totals[linksTo] = totals[linksTo] ? totals[linksTo] + 1 : 1;
        results[word] = totals;
      }
    });
    return results;
  };

  var obtainRankingFromLinks = function(links) {
    var keys = _.keys(links);
    var ranking = [];
    _.each(keys, function(word){
      var linkedToMe = _.filter(keys, function(key){
        var linked = _.keys(links[key]);
        return _.find(linked, function(link) { return link === word; });
      });
      var total = _.reduce(linkedToMe, function(memo, link){
        var linksToTheWord = links[link][word];
        var otherLinksFromTheSource = thisWordLinksTo(link, links);
        return memo + (linksToTheWord/otherLinksFromTheSource);
      }, 0);
      ranking.push({ word: word, total: total });
    });

    return ranking;
  };

  var thisWordLinksTo = function(word, words) {
    var links = _.keys(words[word]);
    return _.reduce(links, function(memo, link){ return memo + words[word][link]; }, 0);
  };

  var getSentencesWithRelatedWeigth = function(sentences, weights) {
    var results  = _.map(sentences, function(sentence){
      var words  = itemize(sentence);
      var weight = _.reduce(words, function(memo, word){
        var pageRank = _.find(weights, function(e){ return e.word === word; });
        return memo + (pageRank ? pageRank.total : 0);
      }, 0);
      return { sentence: sentence, weight: weight };
    });

    return results;
  };

  var summarize = function(text) {
    var words = itemize(text);
    var weights = pageRank(words);
    var sentences = text.split(".");
    return getSentencesWithRelatedWeigth(sentences, weights);
  };

  return {
    summarize: summarize
  };
})();
