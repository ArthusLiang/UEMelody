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
            _oneBeat=24,// the length of one beat
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
        * @param duration number 1/4,1/16,1/8,1/12,1/2,1
        * @param hasDot boolen
        */
        var Note =function(rollcall,duration,hasDot){
            this.Rollcall = rollcall;
            this.Duration = duration;
            this.HasDot = hasDot;
            this._len = duration * 96 * (hasDot ? 1.5 : 1);//duratuib * 4 * 24
            this.IsPart = false;
        };

        /*
        # @param 3/4 4/4 6/8
        * @param numerator number
        * @param denominator number
        */
        var Section=function(numerator,denominator){
            this.Numerator = numerator;
            this.Denominator = denominator;
            this._len = numerator/denominator*96;
            this.Data=[];
        };
        Section.prototype={
            add:function(note){
                if(note instanceof of Note){

                }
            },
            remove:function(pIndex){

            }
        };



        //var tune = new MusicScore('C','major','4/4');
        var MusicScore = function(alphabet,intervalName,beat){
            var me =this,
                _intervalName = Core.isArray(TuneInterval[intervalName]) ? intervalName : 'major',
                _alphabet = MusicalAlphabet[alphabet]!=undefined ? alphabet : 'C';
                _beat = regBeat.test(beat) || '4/4',
                _beatArr = _beat.split('/');

            me.Mode={
                Alphabet:_alphabet,
                Interval:_intervalName,
                Name:_alphabet+_intervalName,
                Beat:_beat,
                Numerator:_beatArr[0],
                Denominator:_beatArr[1]
            };
            me.Data=[];
        };
        MusicScore.prototype={
            FreqChat:freqChat,
            w:function(note){
                if(note instanceof of Note){
                    this.Data.push(note);
                }
            },
            wrtieSection:function(numerator,denominator){

            },
            copy:function(){

            },
            print:function(){

            },
            compile:function(){

            }
        };

        Guitar.MusicScore = MusicScore;

    })();


    (function(){

        var Player = function(){

        };
        Player.prototype=function(){

        };

    })();

    (function(){
        var Board = function(canvas){
            this.canvas;
        };
        Board.prototype=function(){
            draw:function(){

            },
            background:function(){

            }
        };

        Guitar.Board = Board;
    })();




    window.Guitar =Guitar;

})();