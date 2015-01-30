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
                var _time = _ctx.currentTime+0.5;
                //send information
                for(i=0,_l=this.ChannelPairs.length;i<_l;i++){
                    this.ChannelPairs[i].send(_data[i],_time,me.Interval);
                }
                //set callback
                _osc.start(_time);
                _osc.stop(_time+_data[0][0].length*_interval);
                console.log(_data[0][0].length*_interval);
            }

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
            data= data.sub(_start);
            data= data.slice(0,data.length-data.length%8);

            while(data.sub(data.length-8)==='00000000'){
                data = data.slice(0,data.length-8);
            }
            var Hello = SonicCoder.decode(data);
            console.log('Hello');
            return Hello;
        },
        receive:function(){
            console.log('start receiving');
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
                            console.log('stop receving');
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
        }
    };

    window.Band = Band;
})();

/*

*/