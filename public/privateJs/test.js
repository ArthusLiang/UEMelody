(function(){
    window.onload=function(){
        var N = function(rollcall,duration,freqIndex,hasDot,isPart){
            return new Jsonic.Melody.Note(rollcall,duration,freqIndex,hasDot,isPart);
        };

        var player = new Jsonic.Melody.Track();
        var TillTheEndOfTheWorld = new Jsonic.Melody.MusicScore('E','major','4/4');

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



        var painter = new Jsonic.Painter(),
            canvasList= document.getElementsByTagName('canvas');
        painter.attach(canvasList[0],player.AnalyserNode,{'BF':{func:'cricle'}});
        painter.attach(canvasList[1],player.AnalyserNode,{'FF':{func:'wave'}});

        player.onend=function(){
            painter.stop();
        };

        /*
        setTimeout(function(){
            player.play(TillTheEndOfTheWorld,90);

        },100);
        */
        /*
        var myVoix = new Jsonic.Voix(undefined,undefined,true);

        myVoix.bind('hi',function(){
            alert('hi');
        });
        myVoix.bind('hello',function(){
            player.play(TillTheEndOfTheWorld,90);
            painter.start();
        });

        myVoix.start();
        */

        var ultrasoundCore = new Jsonic.Ultrasound(),
            _accept = ultrasoundCore.createAccepter();
        _accept.bind('1',function(){
            console.log('Got you 1');
        });
        _accept.onstart=function(){
            painter.attach(canvasList[2],_accept.Analyser,{'FF':{func:'rectangle'}});
            painter.start();
        };
        _accept.start();


    };
})();