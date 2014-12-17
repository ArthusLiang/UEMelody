(function(){
    window.onload=function(){
        var Note = Guitar.Note,
            myMs = new Guitar.MusicScore('C','major','4/4');
        myMs.w(new Note(3),new Note(3),new Note(4),new Note(5));
        myMs.w(new Note(5),new Note(4),new Note(3),new Note(2));
        myMs.w(new Note(1),new Note(1),new Note(2),new Note(3));
        myMs.w(new Note(3),new Note(1));

        myMs.compile();
        window.myMs = myMs;
    };
})();