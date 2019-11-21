/**
 * Created by echovanec on 18. 12. 2014.
 */

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','_gaTrack');

_gaTrack('create', 'UA-57743254-42', 'auto');
_gaTrack('send', 'pageview');

var partnerName = 'zWebStorm';

// this event is created when user enters main menu
function analyticsOnMainMenuLoadEvent(){
    _gaTrack('send', 'event', 'basic', 'loaded', partnerName, 1);
}

// this event is created when game starts to load assets
function analyticsOnGameStartEvent(){
    _gaTrack('send', 'event', 'basic', 'started', partnerName, 1);
}

function analyticsOnLevelStartEvent(){
    _gaTrack('send', 'event', 'basic', 'play', partnerName, 1);
}

function analyticsOnLevelRefresh(){
    _gaTrack('send', 'event', 'basic', 'playAgain', partnerName, 1);
}
