(function(){

    var guitar = {};

    //Major minor

    (function(){
        var A1=440,
            MusicalAlphabet = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
            RollCallName=['do','re','mi','fa','sol','la','si'],
            RollCall= [1,2,3,4,5,6,7],
            freqChat={},
            freqRange=7;

        var Tune = function(){

        };
        Tune.prototype={
            FreqChat:freqChat
        };

        guitar.Tune = Tune;

    })();



    guitar.Board = function(){

    };
    guitar.Board.prototype=function(){

    };

})();