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

    //
    var Channel = function(start,peak,length,unit,minStep){
        this.StartIndex = start;
        this.PeakIndex = start+peak;
        this.EndIndex = start+length-1;
        this.MinStep = minStep;
        this.Unit = unit;
        this.PeakFreq = this.PeakIndex *unit;
    };
    Channel.prototype={
        get:function(data){
            var i;
            //check range
            if(data[peak]-data[start]<this.MinStep){
                return '0';
            }
            //check sin
            for(i=start;i<peak;i++){
                if(data[i]>=data[i+1]){
                    return '0';
                }
            }
            for(i=end;i>peak;i--){
                if(data[i]>data[i-1]){
                    return '0';
                }
            }
            return '1';
        },
        initSender:function(ctx){
            if(ctx){
                this.Ctx = ctx;
                this.Gain = ctx.createGain();
                this.Osc = ctx.createOscillator();

                this.Gain.gain.value=0;
                this.Osc.frequency.value = this.PeakFreq;

                this.Osc.connect(this.Gain);
                this.Gain.connect(ctx.destination);
                this.Osc.start(0);
            }
        }
    };

    var Band = function(opt){
        this.Opt = Jsonic.extend({
            SampleRate:192000,//
            DataWidth:1024,//analyserNode.frequencyBinCount
            From:20000,
            ChannelWidth:5,
            ChannelNum:4,
            ChannelMinStep:10
        },opt,true);

        this._init();
    };
    Band.prototype={
        _init:function(){
            var _channels=[],
                _unit = this.Opt.SampleRate/2/this.Opt.DataWidth,
                _start= Math.ceil(this.Opt.From/_unit),
                _peakStep = Math.ceil(this.Opt.ChannelWidth/2)-1,
                _channelWidth = this.Opt.ChannelWidth,
                _minStep = this.Opt.ChannelMinStep;
            this.Unit = _unit;
            for(var i=0,l=this.Opt.ChannelNum;i<l;i++){
                _channels.push(new Channel(_start,_peakStep,_channelWidth,_unit,_minStep));
                _start+=_channelWidth;
            }
            this.Channels= _channels;//public proprety
        },
        get:function(data){
            var _val=[];
            for(var i=0,l=this.Channels.length;i<l;i++){
                _val.push(this.Channels[i].get(data));
            }
            return _val();
        },
        initSender:function(ctx){
            for(var i=0,l=this.Channels.length;i<l;i++){
                this.Channels[i].initSender(ctx);
            }
        },
        send:function(data,start,gap){
            var _num =this.Opt.ChannelNum,
                _t=0;
            console.log(data);
            for(var i=0,l=data.length;i<l;i+=_num){
                _t=start+gap*(i/_num);
                this.Channels[0].Gain.gain.setValueAtTime(+data[i],_t);
                this.Channels[1].Gain.gain.setValueAtTime(+data[i+1],_t);
                this.Channels[2].Gain.gain.setValueAtTime(+data[i+2],_t);
                this.Channels[3].Gain.gain.setValueAtTime(+data[i+3],_t);
                console.log([+data[i],+data[i+1],+data[i+2],+data[i+3]].join(''),_t);
            }
        }
    };

    var SonicSender= function(audioContext,band){
        this.AudioContext = audioContext || new AudioContext();
        this.Band = band || new Band();
        this.CanSend = true;
        this.Band.initSender(this.AudioContext);
        this.Gap=0.5;
    };
    SonicSender.prototype={
        send:function(data,callback){
            var me = this;
            if(me.CanSend){
                me.CanSend= false;
                var _ctx = this.AudioContext,
                    _time = _ctx.currentTime+0.5,
                    _data = SonicCoder.encode(data),// Zero is important
                    _gap = this.Gap,
                    _l= _data.length,
                    _osc = _ctx.createOscillator();

                this.Band.send(_data,_time,_gap);

                _osc.frequency.value= 44400;
                _osc.connect(_ctx.destination);
                _osc.onended=function(){
                    me.CanSend = true;
                    callback && callback();
                };
                _osc.start(_time);
                _osc.stop(_time+_l/this.Band.Opt.ChannelNum*_gap);
            }
        }
    };

    window.SonicSender = SonicSender;

    var SonicLisener = function(){

    };
    SonicLisener.prototype = new Jsonic.Message();
    SonicLisener.prototype.constructor=SonicLisener;

    var Ultrasound= function(){
        this.AudioContext = new AudioContext();
        this.Bands = [];

    };



})();

/*
    Ultrasound.prototype = new Jsonic.Message();
    Ultrasound.prototype.constructor=Ultrasound;

    Jsonic.extend(Ultrasound.prototype,{
        send:function(data){
            var _data = SonicCoder.encode(data);
        },
        listen:function(Band){

        },
        addSendBand:function(){

        },
        addListenBand:function(){

        }
    });


var _band = new Band();
var _mc = new Jsonic.Ultrasound();




use 20000-22000 every 50hz as default

one line:

11111110000000(len)(|)(content)00000001111111

detect '0000000011111111' for free to ask request
detect '1111111100000000' for free to registor

shake hands 3 times to macth

----------------------------

UDP
-----------------------------------------------
var QRcode = new SonicQR();
QR.send();

QR.listen(function(data){

});

HTTP
----------------------------------------------
var us = new Utrasound();
us.listen(channel1);

*/