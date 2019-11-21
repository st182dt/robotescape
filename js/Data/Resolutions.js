var ORIENTATION_PORTRAIT     = 0;
var ORIENTATION_LANDSCAPE    = 1;
var GAME_CURRENT_ORIENTATION = ORIENTATION_PORTRAIT;

var game_resolutions = {
    0: { // 0 - portrait
        x:650,//600
        yMin: 1100,//1150,
        yMax: 1600
    },
    1: { // 1 - landscape
        y: 640,
        xMin: 1100,
        xMax: 2000
    }
};

function getMaxGameResolution() {
    return [game_resolutions[1]['xMax'], game_resolutions[0]['yMax']];
}
