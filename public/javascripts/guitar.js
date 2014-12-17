(function(){

    var Guitar ={},
        Core = new function(){
            this.extend=function(target,source){
                var args=[].slice.call(arguments),
                    i=1,
                    key,
                    ride= typeof args[args.length-1] == 'boolean' ? args.pop() : true;
                if(args.length==1){
                    target = !this.window ? this: {};
                    i=0;
                }
                while((source=args[i++])){
                    for(key in source){
                        if(ride || !(key in target)){
                            target[key] =source[key];
                        }
                    }
                }
                return target;
            };
            this.isArray=function (obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            };
        },
        Timer=function(){

        };

    /*
    * @namespace   MusicScore
    * @Author:     yulianghuang
    * @CreateDate  2014/12/12
    * @Desciption  Record Music Score
    */
    (function(){
        var MusicalAlphabet = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
            RollCallName=['do','re','mi','fa','sol','la','si'],
            TuneInterval={
                major:[2,2,1,2,2,2,1],
                minor:[2,1,2,2,1,2,2],
                major5:[2,2,3,2,3],
                minor5:[2,3,2,3,2]
            },
            RollCall= [1,2,3,4,5,6,7],//0 is special standard for no sound
            freqChat={},
            freqRange=7,//C1-C7
            regBeat=/^\d\/\d/,
            _oneBeat=96,// the length of one beat
            i,j,base;

        //init freq chat
        for(i=1;i<freqRange;i++){
            freqChat[i]={};
            base = (i-1)*12;
            for(j=0;j<12;j++){
                //A1=440
                freqChat[i][MusicalAlphabet[j]]=440*Math.pow(2,(base+j-9)/12);
            }
        }

        /*
        * @param rollcall number in [1,2,3,4,5,6,7]
        * @param duration number 1,1/2,1/4,1/8,1/12,1/16
        * @param hasDot boolen
        */
        var Note =function(rollcall,duration,freqIndex,hasDot,isPart){
            this.Rollcall = rollcall;
            this.FreqIndex = freqIndex || 3;
            this.Duration = duration || 1/4;
            this.HasDot = hasDot;
            this._len = this.Duration * _oneBeat * (hasDot ? 1.5 : 1);//duratuib * 4 * 24
            this.IsPart = isPart;
            this.setDot();
        };
        Note.prototype={
            divid:function(remain,sectionMax){
                var me= this,
                    _len = me._len,
                    _arr=[];
                if(_len<=remain){
                    _arr.push(me);
                }else{
                    var _r = _len - remain,
                        _i = (_r/sectionMax) >>0,
                        _j = _r%sectionMax,
                        _rollCall = me.Rollcall,
                        _freqIndex = me.FreqIndex;
                    remain!==0 && _arr.push(new Note(_rollCall,remain/_oneBeat,_freqIndex));
                    for(var i=0;i<_i;i++){
                        _arr.push(new Note(_rollCall,sectionMax/_oneBeat,_freqIndex,false,true));
                    }
                    _arr.push(new Note(_rollCall,_j/_oneBeat,_freqIndex,false,true));
                }
                return _arr;
            },
            setDot:function(){
                if(this._len % 9 == 0 && !this.HasDot){
                    this.Duration = this.Duration/3*2;
                    this.hasDot = true;
                }
            }
        };

        //var tune = new MusicScore('C','major','4/4');
        var MusicScore = function(alphabet,intervalName,beat){
            var me =this,
                _intervalName = Core.isArray(TuneInterval[intervalName]) ? intervalName : 'major',
                _alphabet = MusicalAlphabet[alphabet]!=undefined ? alphabet : 'C';
                _beat = regBeat.test(beat) ? beat : '4/4',
                _beatArr = _beat.split('/');

            me.Mode={
                Alphabet:_alphabet,
                Interval:_intervalName,
                Name:_alphabet+_intervalName,
                Beat:_beat,
                Numerator:_beatArr[0],
                Denominator:_beatArr[1],
                SectionMax:_beatArr[0]/_beatArr[1]*_oneBeat
            };
            me.Data=[];
            me.Sections=[];
            this.IsCompiled=false;
        };
        MusicScore.prototype={
            FreqChat:freqChat,
            w:function(){
                var arr = arguments;
                for(var i=0,l=arguments.length;i<l;i++){
                    if(arguments[i] instanceof Note){
                        this.Data.push(arguments[i]);
                    }
                }
                this.IsCompiled=false;
            },
            d:function(index,num){
                this.Data.splice(index,num);
                this.IsCompiled=false;
            },
            u:function(){
                this.Data.splice.apply(this,arguments);
                this.IsCompiled=false;
            },
            r:function(start,end){
                return this.Data.slice(start,end);
                this.IsCompiled=false;
            },
            reverse:function(){
                this.Data.reverse();
                this.IsCompiled=false;
            },
            merge:function(musicScore){
                this.Data = this.Data.concat(musicScore.Data);
                this.IsCompiled=false;
            },
            compile:function(){
                this.IsCompiled=false;
                var me = this,
                    _data= me.Data,
                    _n = me.Mode.Numerator,
                    _d = me.Mode.Denominator,
                    _sectionMax = me.Mode.SectionMax,
                    //init
                    _last=0,
                    _remain = _sectionMax,
                    _sections = [[]],
                    j,k;

                for(var i=0,l=_data.length;i<l;i++){
                    var _note = _data[i];
                    if(_note._len<=_remain){
                        _sections[_last].push(_note);
                        _remain-=_note._len;
                    }else{
                        var _noteArr = _note.divid(_remain,_sectionMax);
                        if(_remain === 0){
                            _last++;
                           _sections[_last] = [_noteArr[0]];
                        }else{
                            _sections[_last].push(_noteArr[0]);
                        }
                        for(j=1,k=_noteArr.length;j<k;j++){
                            _last++;
                            _sections[_last]=[_noteArr[j]];
                        }
                        _remain = _sectionMax-_sections[_last][0]._len;
                    }
                }
                delete me.Sections;
                me.Sections = _sections;
                this.IsCompiled=true;
                return _sections;
            }
        };

        Guitar.MusicScore = MusicScore;
        Guitar.Note = Note;
    })();


    /*
    * @namespace   MusicScore
    * @Author:     yulianghuang
    * @CreateDate  2014/12/12
    * @Desciption  Record Music Score
    */
    (function(){
        var Track = function(){

        };
        Track.prototype = {
            record:function(){

            },
            play:function(){

            }
        };

        var Player = function(){

        };
        Player.prototype={
            record:function(){

            },
            play:function(){

            }
        };

    })();

    /*
    * @namespace   MusicScore
    * @Author:     yulianghuang
    * @CreateDate  2014/12/12
    * @Desciption  Record Music Score
    */
    (function(){
        var patterns={
            dot:function(x,y,w,h,note){

            },
            num:function(x,y,w,h,note){

            },
            rect:function(x,y,w,h,note){

            }
        };

        var Board = function(canvas,config,musicScore){
            var _config = Core.extend({
                X1:0,
                GradeWidth:16,
                Y1:0,
                GradeHeight:80,
                GradeNumber:12,
                DirectionX:true
            },config,true);

            if(DirectionX){
                _config.RectW = _config.GradeHeight;
                _config.RectH = _config.GradeWidth;
            }else{
                _config.RectW = _config.GradeWidth;
                _config.RectH = _config.GradeHeight;
            }

            this.Config=_config;
            this.Canvas= canvas;
            this.MusicScore = musicScore;
        };
        Board.prototype={
            draw:function(notes,func){
                for(var i=0,l=note.length;i<l;i++){
                    patterns[func](note);
                }
            },
            background:function(canvas){

            },
            pattern:function(){

            }
        };

        Guitar.Board = Board;
    })();




    window.Guitar =Guitar;

})();