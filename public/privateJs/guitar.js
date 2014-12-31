(function(){
    window.onload=function(){
        var N = function(rollcall,duration,freqIndex,hasDot,isPart){
            return new Guitar.Note(rollcall,duration,freqIndex,hasDot,isPart);
        };

        var player2 = new Guitar.Player();
        var myMs = new Guitar.MusicScore('D','major','4/4');

        myMs.w(N(3),N(3),N(4),N(5));
        myMs.w(N(5),N(4),N(3),N(2));
        myMs.w(N(1),N(1),N(2),N(3));
        myMs.w(N(3,1/4,0,true),N(2,1/8),N(2,1/2));

        myMs.w(N(3),N(3),N(4),N(5));
        myMs.w(N(5),N(4),N(3),N(2));
        myMs.w(N(1),N(1),N(2),N(3));
        myMs.w(N(2,1/4,0,true),N(1,1/8),N(1,1/2));

        myMs.w(N(2),N(2),N(3),N(1));
        myMs.w(N(2),N(3,1/8),N(4,1/8),N(3),N(1));
        myMs.w(N(2),N(3,1/8),N(4,1/8),N(3),N(2));
        myMs.w(N(1),N(2),N(5,1/4,-1),N(3));

        myMs.w(N(3),N(3),N(4),N(5));
        myMs.w(N(5),N(4),N(3),N(2));
        myMs.w(N(1),N(1),N(2),N(3));
        myMs.w(N(2),N(1),N(1),N(0));
        myMs.reverse();
        myMs.compile();
        //player2.play(myMs,120);

        var player = new Guitar.Player();
        var TillTheEndOfTheWorld = new Guitar.MusicScore('E','major','4/4');

        TillTheEndOfTheWorld.w(N(0,1/4,0,true),N(1,1/8,1),N(7,1/8),N(6,1/8),N(5,1/8),N(6,1/8));
        TillTheEndOfTheWorld.w(N(5,1/8),N(5,1/8),N(5),N(0),N(3,1/8),N(5,1/8));
        TillTheEndOfTheWorld.w(N(6,1/8,0,true),N(6,1/16),N(6,1/8),N(6,1/8),N(5),N(6,1/8),N(3,1/8));
        TillTheEndOfTheWorld.w(N(3),N(0,1/2,0,true));

        TillTheEndOfTheWorld.w(N(0,1/4,0,true),N(1,1/8,1),N(7,1/8,0,true),N(2,1/16,1),N(2,1/16,1),N(6,1/8),N(7,1/16));
        TillTheEndOfTheWorld.w(N(7,1/8),N(6,1/16),N(5,1/16),N(5),N(0,1/8),N(5,1/8),N(5,1/16),N(5,1/8),N(6,1/16));
        TillTheEndOfTheWorld.w(N(6,1/8),N(6),N(6,1/8),N(7,1/8,0,true),N(1,1/16,1),N(1,1/8,1),N(2,1/8,1));
        TillTheEndOfTheWorld.w(N(2,1/2,1),N(6),N(7));

        TillTheEndOfTheWorld.w(N(1,1/8,1,true),N(7,1/16),N(7,1/8),N(7,1/8),N(1,1/8,1),N(7,1/8),N(7,1/8),N(1,1/8,1));
        TillTheEndOfTheWorld.w(N(1,1/2,1),N(6),N(7));
        TillTheEndOfTheWorld.w(N(1,1/8,1),N(7,1/8),N(7,1/16),N(1,1/8,1,true),N(1,1/8,1),N(2,1/8,1),N(1,1/8,1),N(1,1/8,1));
        TillTheEndOfTheWorld.w(N(1,1/2,1),N(6),N(7));

        TillTheEndOfTheWorld.w(N(1,1/8,1),N(7,1/8),N(7,1/8),N(1,1/8,1),N(0,1/8),N(2,1/4,1),N(3,1/8,1));
        TillTheEndOfTheWorld.w(N(4,1/8,1,true),N(3,1/16,1),N(2,1/8,1),N(2,1/8,1),N(1,1/8,1),N(1,1/8,1),N(3,1/8,1),N(2,1/8,1));
        TillTheEndOfTheWorld.w(N(2,1,1));
        TillTheEndOfTheWorld.w(N(0),N(4,1/8,1),N(4,1/8,1),N(4,1/8,1),N(4,1/8,1),N(4,1/8,1),N(4,1/8,1),N(4,1/8,1),N(4,1/8,1));

        TillTheEndOfTheWorld.w(N(4,1/8,1),N(3,1/8,1),N(2,1/8,1),N(3,1/8,1),N(3,1/2,1));
        TillTheEndOfTheWorld.w(N(3,1/4,1),N(5),N(1,1/4,1),N(6,1/4,1));
        TillTheEndOfTheWorld.w(N(6,1/8,1),N(5,1/8,1),N(0,1/8),N(5,1/8,1),N(5,1/8,1),N(3,1/8,1),N(3,1/8,1),N(5,1/8,1));
        TillTheEndOfTheWorld.w(N(5,1/2,1),N(3,1/8,1),N(4,1/4,1),N(5,1/8,1));

        TillTheEndOfTheWorld.w(N(5,1/8,1),N(4,1/4,1),N(4,1/8,1),N(4,1/8,1),N(3,1/8,1),N(3,1/8,1),N(3,1/16,1),N(2,1/16,1));
        TillTheEndOfTheWorld.w(N(2,1/4,1),N(0,1/8),N(6,1/8),N(1,1/4,1),N(5,1/4,1));
        TillTheEndOfTheWorld.w(N(5,1/8,1),N(4,1/4,1),N(4,1/8,1),N(4,1/8,1),N(3,1/8,1),N(3,1/8,1),N(2,1/8,1));
        TillTheEndOfTheWorld.w(N(2,1/4,1),N(4,1/8,1),N(4,1/8,1),N(4,1/8,1),N(4,1/8,1),N(4,1/8,1),N(4,1/8,1));

        TillTheEndOfTheWorld.w(N(4,1/8,1),N(3,1/8,1),N(2,1/8,1),N(3,1/8,1),N(3,1/2,1));
        TillTheEndOfTheWorld.w(N(3,1/4,1),N(5),N(1,1/4,1),N(6,1/4,1));
        TillTheEndOfTheWorld.w(N(6,1/8,1),N(5,1/8,1),N(0,1/8),N(5,1/8,1),N(5,1/8,1),N(3,1/8,1),N(3,1/8,1),N(5,1/8,1));
        TillTheEndOfTheWorld.w(N(5,1/2,1),N(3,1/8,1),N(4,1/4,1),N(5,1/8,1));

        TillTheEndOfTheWorld.w(N(5,1/8,1),N(4,1/4,1),N(4,1/8,1),N(0,1/8),N(6,1/8),N(1,1/8,1),N(5,1/8,1));
        TillTheEndOfTheWorld.w(N(5,1/8,1),N(5,1/8,1),N(4,1/8,1),N(3,1/8,1),N(3,1/8,1),N(4,1/4,1),N(2,1/8,1));
        TillTheEndOfTheWorld.w(N(2,1,1));
        TillTheEndOfTheWorld.w(N(0,1/4),N(2,1/8,1),N(3,1/8,1),N(4,1/8,1),N(3,1/4,1),N(2,1/8,1));

        TillTheEndOfTheWorld.w(N(2,1/8,1),N(1,1/4,1),N(1,1/8,1),N(1,1/2,1));
        TillTheEndOfTheWorld.w(N(1,1/4,1),N(0,1/8),N(2,1/16,1),N(3,1/16,1),N(4,1/8,1),N(3,1/4,1),N(2,1/8,1));
        TillTheEndOfTheWorld.w(N(7,1/8),N(1,1/8,1),N(1,1/2,1,true));
        TillTheEndOfTheWorld.w(N(1,1/2,1),N(0,1/2));

        TillTheEndOfTheWorld.compile();
        player.play(TillTheEndOfTheWorld,90);

        window.myMs = myMs;
    };
})();