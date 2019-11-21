var Languages = function()
{
    if(Languages.instance != null)
        return Languages.instance;

    Languages.instance = this;

    this.gameTextsParsed = null;
    this.xml = null;
    this.gameTextsLists = [];

    var xml = game.cache.getText('lang_strings');
    var parser = new DOMParser();
    this.gameTextsParsed = parser.parseFromString(xml, "text/xml");
    var document = this.gameTextsParsed.getElementsByTagName('string');
    for (var i = 0; i < document.length; i++){
        if (this.gameTextsLists[document.item(i).getAttribute("id")] == null){
            this.gameTextsLists[document.item(i).getAttribute("id")] = [];
        }

        for(var j = 0; j < LANGUAGES.length; j++)
            if (document.item(i).getElementsByTagName(LANGUAGES[j]).length >0) {
                this.gameTextsLists[document.item(i).getAttribute("id")][LANGUAGES[j]] = document.item(i).getElementsByTagName(LANGUAGES[j])[0].textContent.replace(/\\n/g, '\n').toUpperCase();
            }
    }
};

var LANGUAGES = ["sk","en", "de", "es", "fr", "it", "br","ru"];

Languages.instance = null;

Languages.prototype = {};

function STR(id)
{
    id=id.toUpperCase();
    if (Languages.instance.gameTextsLists[id] == undefined || Languages.instance.gameTextsLists[id][Languages.instance.language] == undefined) {
        LOG('STR(' + id + ') MISSING!')
        return "NAN";
    }

    var retVal = Languages.instance.gameTextsLists[id][Languages.instance.language];
    return retVal.replaceAll('\\n', '\n') ;
}