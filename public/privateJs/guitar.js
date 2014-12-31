(function(){
    window.onload=function(){
        var Note = Guitar.Note,
            myMs = new Guitar.MusicScore('D','major','4/4');

        myMs.w(new Note(3),new Note(3),new Note(4),new Note(5));
        myMs.w(new Note(5),new Note(4),new Note(3),new Note(2));
        myMs.w(new Note(1),new Note(1),new Note(2),new Note(3));
        myMs.w(new Note(3,1/4,0,true),new Note(2,1/8),new Note(2,1/2));

        myMs.w(new Note(3),new Note(3),new Note(4),new Note(5));
        myMs.w(new Note(5),new Note(4),new Note(3),new Note(2));
        myMs.w(new Note(1),new Note(1),new Note(2),new Note(3));
        myMs.w(new Note(2,1/4,0,true),new Note(1,1/8),new Note(1,1/2));

        myMs.w(new Note(2),new Note(2),new Note(3),new Note(1));
        myMs.w(new Note(2),new Note(3,1/8),new Note(4,1/8),new Note(3),new Note(1));
        myMs.w(new Note(2),new Note(3,1/8),new Note(4,1/8),new Note(3),new Note(2));
        myMs.w(new Note(1),new Note(2),new Note(5,1/4,-1),new Note(3));

        myMs.w(new Note(3),new Note(3),new Note(4),new Note(5));
        myMs.w(new Note(5),new Note(4),new Note(3),new Note(2));
        myMs.w(new Note(1),new Note(1),new Note(2),new Note(3));
        myMs.w(new Note(2),new Note(1),new Note(1),new Note(0));
        myMs.compile();

        var player = new Guitar.Player();
        player.play(myMs,120);

        window.myMs = myMs;
    };
})();