(function(){

    var _Jsonic = window.Jsonic,
        _$=window.$;

    //The Core
    var Jsonic =new function(){
        //Info
        this.Version ='1.0.0';
        this.Author='yulianghuang';

        var _pkid=0;
        /*
        * Get the global pkid
        * @return {number}
        */
        this.getPkid=function(){
            return _pkid++;
        };
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
        this.isEmptyObject=function(obj){
            for(var name in obj){
                return false;
            }
            return true;
        };
        this.noConflict=function(deep){
            window.$ = _$;
            if(deep){
                window.Jsonic =_Jsonic
            }
        };
    };

    //compatibility
    Jsonic.Browser=new function(){
        var me=this,
            _regConfig = {
            Chrome:{
                Reg: /.*(chrome)\/([\w.]+).*/,
                Core: "webkit"
            },
            Safari:{
                Reg: /.*version\/([\w.]+).*(safari).*/,
                Core: "webkit"
            },
            IE:{
                Reg: /.*(msie) ([\w.]+).*/,
                Core: "ms"
            },
            Firefox:{
                Reg: /.*(firefox)\/([\w.]+).*/,
                Core: "moz"
            },
            Opera:{
                Reg: /(opera).+version\/([\w.]+)/,
                Core: "webkit"
            }
        },
        _result,
        _userAgent = navigator.userAgent.toLowerCase();

        me.Name='chrome';
        me.Prefix='webkit';
        me.Version='1';

        for(var _o in _regConfig){
            _result = _regConfig[_o].Reg.exec(_userAgent);
            if(_result !=null){
                me.Name= _result[1] || 'chrome';
                me.Version=_result[2] || 'webkit';
                me.Prefix=_regConfig[_o].Core || '1';
                break;
            }
        }
        //compatibility
        me.attrPrefix=function(obj,attr,func){
            obj[attr] = obj[attr] || obj[me.Prefix+attr] || func;
        };

        //init relatived property
        me.attrPrefix(window,'AudioContext');
        me.attrPrefix(window.navigator,'GetUserMedia');
        //me.attrPrefix(window,'VoiceRecognition');  //only used in voice recognition mode
        me.attrPrefix(window,'requestAnimationFrame',function(callback,el){
            return setTimeout(callback,1000/60);
        });
    };


    //Message Mode
    Jsonic.Message=function(){
        this.Lib={};//* store handles
        this.Dic={};//  store smart learning dictionary
    };
    Jsonic.Message.prototype={
        bind:function(msg,func) {
            if(!func.$pkid){
                func.$pkid = Jsonic.getPkid();
            }
            var _lib= this.Lib,
                _msg
                _msgs = Jsonic.isArray(msg) ? msg : [msg];
            for(var i=0,l=_msgs.length;i<l;i++){
                _msg = _msgs[i];
                if(_lib[_msg]===undefined){
                    _lib[_msg]={
                        handles:{}
                    };
                }
                _lib[_msg].handles[func.$pkid] = func;
            }
        },
        unbind:function(msg,func){
            var _msgs = Jsonic.isArray(msg) ? msg : [msg],
                handles;
            for(var i=0,l=_msgs.length;i<l;i++){
                handles = this.Lib[_msgs[i]];
                if(handles!=undefined && func.$$pkid !=null){
                    delete handles.listeners[func.$$pkid];
                }
            }
        },
        on:function(msg) {
            if(this.Lib[msg] === undefined && this.Dic && this.Dic.get){
                msg = this.Dic.get(msg);
            }
            if(msg && this.Lib[msg]){
                var handles = this.Lib[msg].handles;
                for(var name in handles){
                    handles[name]();
                }
            }
        },
        one:function(msg,func){
            var me =this,
                _func = function(){
                    func.call(me);
                    me.unbind(msg,_func);
                };
            me.bind(msg,_func);
        }
    };


    window.Jsonic = Jsonic;

    //AMD
    if (typeof window.define === 'function' && window.define.amd !== undefined) {
            window.define('Jsonic', [], function () {
                return Jsonic;
            });
    // CommonJS suppport
    }else if(typeof module !== 'undefined' && module.exports !== undefined) {
            module.exports = Jsonic;
    // Default
    }

    /*
    * @namespace   Jsonic.Melody
    * @Author:     yulianghuang
    * @CreateDate  2015/1/4
    */
    (function(window,Jsonic){

        var MusicalAlphabet = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
            RollCallName=['do','re','mi','fa','sol','la','si'],
            TuneInterval={
                major:[0,2,4,5,7,9,11],//[2,2,1,2,2,2,1]
                minor:[0,2,3,5,7,8,10],//[2,1,2,2,1,2,2]
                major5:[0,2,4,7,9],//[2,2,3,2,3]
                minor5:[0,2,5,7,10]//[2,3,2,3,2]
            },
            RollCall= [1,2,3,4,5,6,7],//0 is special standard for no sound
            freqChat={},
            freqRange=5,
            regBeat=/^\d\/\d/,
            regBaseRollCall=/\d/,
            regHalfRollCall=/\#|b/,
            _oneBeat=96,// the length of one beat
            i,j,base;

        //init freq chat
        for(i=-4;i<freqRange;i++){
            freqChat[i]={};
            base = (i-1)*12;
            for(j=0;j<12;j++){
                //A1=440
                freqChat[i][MusicalAlphabet[j]]=440*Math.pow(2,(base+j-9)/12);
            }
        }

        /*
        * @param rollcall number in [0,1,2,3,4,5,6,7]/1#.2b
        * @param duration number 1,1/2,1/4,1/8,1/12,1/16
        * @param freIndex number the index of the note array
        * @param hasDot boolen
        * @param isPart for complie
        */
        var Note =function(rollcall,duration,freqIndex,hasDot,isPart){
            this.Rollcall = rollcall;
            this.FreqIndex = freqIndex || 0;
            this.Duration = duration || 1/4;
            this.HasDot = hasDot;
            this._len = this.Duration * _oneBeat * (hasDot ? 1.5 : 1);//duratuib * 4 * 24
            this.IsPart = isPart;
            this.setDot();
            this.BaseRollCall = +regBaseRollCall.exec(rollcall)[0];
            var _half = regHalfRollCall.exec(rollcall);
            if(_half){
                this.HalfRollCall = _half[0] == '#' ? 1:-1;
            }else{
                this.HalfRollCall=0;
            }
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
                _intervalName = Jsonic.isArray(TuneInterval[intervalName]) ? intervalName : 'major',
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
            me.IsCompiled=false;
            //
            me._baseArrIndex = 1;
            me._baseNameIndex= MusicalAlphabet.indexOf(_alphabet);
            //me._baseXindex = _alphabet.indexOf(me.FreqChat[me._baseArrIndex]);

        };
        MusicScore.prototype={
            FreqChat:freqChat,
            initFreq:function(note){
                if(note.BaseRollCall!==0){
                    var me=this,
                        _tuneInterval = TuneInterval[me.Mode.Interval],
                        _y= me._baseArrIndex+note.FreqIndex,
                        _x= me._baseNameIndex+_tuneInterval[note.BaseRollCall-1]+note.HalfRollCall;

                    _y+= parseInt(_x/12);
                    _x = _x%12;
                    note.frequency = freqChat[_y][MusicalAlphabet[_x]];
                }
            },
            //add new note to the muisc score
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
                    _sum=0,
                    j,k;

                for(var i=0,l=_data.length;i<l;i++){
                    var _note = _data[i];
                    _note.relativeTime = _sum;
                    _sum+=_note._len;
                    me.initFreq(_note);
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

        var Track=function(context){
            this.Ctx = context || new webkitAudioContext();

            //this.Oscillator =this.Ctx .createOscillator();
            this.IsRunning=false;
            //this.Oscillator.connect(this.Ctx.destination);
            this.AnalyserNode = this.Ctx.createAnalyser(),
            this.WaveShaperNode = this.Ctx.createWaveShaper();

            this.WaveShaperNode.connect(this.AnalyserNode);
            this.AnalyserNode.connect(this.Ctx.destination);
        };
        Track.prototype={
            makeDistortionCurve:function(amount){
                var k = typeof amount === 'number' ? amount : 50,
                    n_samples = 44100,
                    curve = new Float32Array(n_samples),
                    deg = Math.PI / 180,
                    i = 0,
                    x;
                for ( ; i < n_samples; ++i ) {
                    x = i * 2 / n_samples - 1;
                    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x));
                }
                this.WaveShaperNode.curve =curve;
            },
            play:function(musicScore,speed,curve){
                var me=this;
                me.IsRunning=true;
                me.MusicScore = musicScore;
                me.makeDistortionCurve(curve);
                var _index=0,
                    _ctx = this.Ctx,
                    _destination = me.WaveShaperNode,
                    _osc = me.Oscillator,
                    _cData,
                    _cTime = _ctx.currentTime,
                    _max=musicScore.Data.length,
                    _speed = speed || 60,
                    _speedRate = 60/_speed/_oneBeat*4,
                    i,l;
                for(i=0,l=musicScore.Data.length;i<l;i++){
                    _cData = musicScore.Data[i];
                    if(_cData.BaseRollCall!=0){
                         delete _cData.Osc;
                        _cData.Osc = _ctx.createOscillator();
                        _cData.Osc.OscillatorType ='sine';
                        _cData.Osc.connect(_destination);
                        _cData.Osc.frequency.value = _cData.frequency;
                        _cData.Osc.start(_cTime+_cData.relativeTime*_speedRate);
                        _cData.Osc.stop(_cTime+(_cData.relativeTime+_cData._len)*_speedRate);
                    }
                }
                for(var i=l-1;i>=0;i--){
                    _cData = musicScore.Data[i];
                    if(_cData.BaseRollCall!==0){
                        _cData.Osc.onended=function(){
                            me.onend();
                        };
                        break;
                    }
                }

                /*  can not call the start of the osc more than once
                _loop=function(){
                    if(me.IsRunning && _index < _max){
                        _cData = musicScore.Data[_index];
                        _osc.frequency.value = _cData.frequency;
                        _osc.start(_cTime+_cData.relativeTime*_speedRate);
                        _osc.stop(_cTime+(_cData.relativeTime+_cData._len)*_speedRate);
                        _osc.onended=function(){
                            _index++;
                            _loop();
                        }
                    }
                };
                _loop();
                */
            },
            stop:function(){
                var me = this,
                    musicScore = me.MusicScore,
                    _cData,i,l;
                me.IsRunning=false;
                for(i=0,l=musicScore.Data.length;i<l;i++){
                    _cData = musicScore.Data[i];
                    if(_cData.BaseRollCall!=0){
                        _cData.Osc.stop();
                        delete _cData.Osc;
                    }
                }
                me.onend();
            },
            onend:function(){

            }
        };

        Jsonic.Melody={
            Track:Track,
            Note:Note,
            MusicScore:MusicScore
        };

    })(window,Jsonic);


    /*
    * @namespace   Jsonic.Band
    * @Author:     yulianghuang
    * @CreateDate  2015/1/30
    */
    (function(){
        var SonicCoder = new function(){
            var me=this,
                _prefixZeroString='0000000000000000',
                toAscii=function(str){
                    var _arr=[];
                    for(var i=0,l=str.length;i<l;i++){
                        _arr.push(me.prefixZero(str.charCodeAt(i).toString(2),8));
                    }
                    return _arr.join('');
                },
                fromAscii=function(str){
                    var _arr=[];
                    for(var i=0,l=str.length;i<l;i+=8){
                        _arr.push(parseInt(str.slice(i,i+8),2));
                    }
                    return String.fromCharCode.apply(this,_arr);
                };

            this.prefixZero=function(str,n){
                return _prefixZeroString.slice(0,n-str.length)+str;
            };
            this.encode=function(str){
                return me.compress(toAscii(encodeURI(str)));
            };
            this.decode=function(str){
                return decodeURI(fromAscii(me.decompress(str)));
            };
            //to do & could be override
            this.compress=function(str){
                return str;
            };
            this.decompress=function(str){
                return str;
            };
        };

        window.SonicCoder = SonicCoder;


        var Channel=function(ctx,peak,edge,base,data){
            this.StartIndex= peak-edge;
            this.PeakIndex = peak;
            this.EndIndex = peak+edge;
            this.Freq = peak*base;
            //
            this.Ctx= ctx;
            this.Osc = ctx.createOscillator();
            this.GainNode = ctx.createGain();
            this.Osc.frequency.value = this.Freq;
            this.GainNode.gain.value=0;
            this.Osc.connect(this.GainNode);
            this.GainNode.connect(this.Ctx.destination);
            this.Osc.start();

            this.Data = data;
        };
        Channel.prototype={
            send:function(data,startTime,duration,needPreDown){
                var _gain = this.GainNode.gain;
                for(var i=0,l=data.length;i<l;i++){
                    _gain.setValueAtTime(data[i],startTime+duration*i);
                    if(data[i] && needPreDown){
                        _gain.setValueAtTime(0,startTime+duration*(i+0.8));
                    }
                }
                _gain.setValueAtTime(0,startTime+duration*i);
            },
            isPeakLike:function(){
                var _data = this.Data,
                    i;
                if(_data[this.PeakIndex]-_data[this.StartIndex]<15){//------------------------------------------> config
                    return 0;
                }
                for(i=this.StartIndex;i<this.PeakIndex;i++){
                    if(_data[i]>=_data[i+1]){
                        return 0;
                    }
                }
                for(i=this.EndIndex;i>this.peak;i--){
                    if(_data[i]>_data[i-1]){
                        return 0;
                    }
                }
                return 1;
            },
            getPeak:function(){
                return this.Data[this.PeakIndex];
            },
            info:function(){
                var _data = this.Data;
                console.log(_data[this.StartIndex]>>0,_data[this.StartIndex+1]>>0,_data[this.PeakIndex]>>0,_data[this.EndIndex-1]>>0,_data[this.EndIndex]>>0);
            }
        };

        var ChannelPair =function(ctx,peakHigh,peakLow,edge,base,data){
            this.High = new Channel(ctx,peakHigh,edge,base,data);
            this.Low = new Channel(ctx,peakLow,edge,base,data);
            this.Count=[0,0];
        };
        ChannelPair.prototype={
            send:function(data,startTime,duration){
                this.High.send(data[1],startTime,duration,true);
                this.Low.send(data[0],startTime,duration);
            },
            get:function(){
                return this.Low.getPeak() > this.High.getPeak() ? 0:1;
            },
            hasPeak:function(){
                return this.High.isPeakLike() || this.Low.isPeakLike();
            },
            clearCount:function(){
                this.Count=[0,0];
            },
            count:function(){
                this.Count[this.get()]++;
            },
            getByCount:function(){
                return this.Count[0] < this.Count[1] ? 1:0;
            }
        };

        var Band = function(audioContext,opt){
            this.AudioContext = audioContext || new AudioContext();
            this.Analyser = (opt && opt.Analyser) ?  opt.Analyser :this.AudioContext.createAnalyser();
            this.FreqData = (opt && opt.FreqData) ?  opt.FreqData :new Float32Array(this.Analyser.frequencyBinCount);
            /*
            opt
            */
            //Jsonic.extend(this.opt);
            this.DataHeader='1111111111111111';
            this.DataEnd='0000000000000000';
            this.CanSend=true;
            this.ChannelPairs=[];

            this.Analyser.smoothingTimeConstant = 0.1;
            this.Interval=0.1;

        };
        Band.prototype={
            initDefaultChannel:function(){
                this.ChannelPairs.push(new ChannelPair(this.AudioContext,216,221,2,93.75,this.FreqData));
                this.ChannelPairs.push(new ChannelPair(this.AudioContext,226,231,2,93.75,this.FreqData));
            },
            addChannelPair:function(){
                for(var i=0,l=arguments.length;i<l;i++){
                    this.ChannelPairs.push(arguments[i]);
                }
                //this.ChannelPairs.concat(arguments);
            },
            complieData:function(data){
                data= this.DataHeader+SonicCoder.encode(data)+this.DataEnd;
                console.log('complie data:',data);
                var _pl = this.ChannelPairs.length,
                    _l=data.length,
                    _data=[],i,j;
                for(i=0;i<_pl;i++){
                    if(data[i]==0){
                        _data[i] = {0:[1],1:[0]};
                    }else{
                        _data[i] = {0:[0],1:[1]};
                    }
                }
                for(;i<_l;i++){
                    j = i%_pl;
                    if(data[i]==0){
                        _data[j][0].push(1);
                        _data[j][1].push(0);
                    }else{
                        _data[j][0].push(0);
                        _data[j][1].push(1);
                    }
                }
                console.log(_data[0][1].join(''));
                console.log(_data[0][0].join(''));
                console.log(_data[1][1].join(''));
                console.log(_data[1][0].join(''));
                return _data;
            },
            send:function(data,callback){
                if(this.CanSend){
                    //lock
                    this.CanSend= false;

                    var me =this,
                        _data= me.complieData(data),//prepare data
                        _ctx = this.AudioContext,
                        _interval = this.Interval,
                        _osc = _ctx.createOscillator();
                    //set callback
                    _osc.frequency.value= 80000;//avoid conflict to channelpairs
                    _osc.connect(_ctx.destination);
                    _osc.onended=function(){
                        me.CanSend = true;
                        callback && callback();
                        console.log('OK');
                    };
                    var _time = _ctx.currentTime+0.5,//-------------------------------------->time left for communicating
                        _last=_data[0][0].length*_interval;
                    //send information
                    for(i=0,_l=this.ChannelPairs.length;i<_l;i++){
                        this.ChannelPairs[i].send(_data[i],_time,me.Interval);
                    }
                    //set callback
                    _osc.start(_time);
                    _osc.stop(_time+_last);
                    console.log(_last);
                    return {
                        last:_last,
                        complieData:_data
                    }
                }
                return false;

            },
            listenSource:function(_input){
                _input.connect(this.Analyser);
            },
            scanEnvironment:function(){
                //console.log('scan environment!');
                var me =this;
                this.Analyser.getFloatFrequencyData(this.FreqData);
                //
                //this.ChannelPairs[0].High.info();
                if(this.ChannelPairs[0].High.isPeakLike() && this.ChannelPairs[1].High.isPeakLike()){
                    me.receive();
                }else{
                    requestAnimationFrame(function(){
                        me.scanEnvironment();
                    });
                }
            },
            _travelPair:function(func){
                for(var i=0,l=this.ChannelPairs.length;i<l;i++){
                    this.ChannelPairs[i][func]();
                }
            },
            onReceived:function(data){
                //去掉1111和00000
                console.log(data);
                var _start=data.indexOf('111111110')+8;
                data= data.slice(_start);
                data = data.slice(0,((data.lastIndexOf('1')/8>>0)+1)*8);
                var Hello = SonicCoder.decode(data);
                this.onMsg(Hello);
                return Hello;
            },
            receive:function(){
                this.onStartReceive();
                var me=this,
                    _start = new Date(),
                    _ob={},
                    _num=0,
                    _now,
                    _range,
                    _distance,
                    _interval = me.Interval*1000,
                    _pos= _interval*0.8,///2
                    _data=[],
                    _pl=this.ChannelPairs.length;

                me._travelPair('clearCount');

                //every frame
                var _callback=function(){
                    _now= new Date();
                    _distance = _now-_start;//ms
                    me.Analyser.getFloatFrequencyData(me.FreqData);
                    //every interval
                    if(_distance%_interval > _pos){
                        _range = _distance/_interval>>0;
                        //sum
                        if(_ob[_range]===undefined){
                            _ob[_range] = 1;
                            _num++;
                            //.....do func
                            //get
                            for(var i=0;i<_pl;i++){
                                _data.push(me.ChannelPairs[i].getByCount());//---------------------------------------->get
                            }
                            console.log(_data);//--------------------------------------------------------------------->log data
                            if(_data.length>12 &&  _data.slice(_data.length-12).join('')==='000000000000'){
                                me.onReceived(_data.join(''));
                                me.onEndReceive();
                                me.scanEnvironment();
                                return;
                            }
                            //clear
                            me._travelPair('clearCount');//----------------------------------------------------------->clear
                        }
                        //incase too long
                        if(_num===1000){
                            _num=0;
                            _start.setSeconds(_start.getSeconds()+_interval);
                            _ob={};
                        }
                    }
                    me._travelPair('count');//------------------------------------------------------------------------>count
                    requestAnimationFrame(_callback);
                    //canrequest && requestAnimationFrame(_callback);
                };
                _callback();
            },
            onMsg:function(data){
                console.log(data);
            },
            onStartReceive:function(){
                console.log('start receiving');
            },
            onEndReceive:function(){
                console.log('stop receiving');
            }
        };

        Jsonic.Band = Band;
    })();


})();

/*

*/