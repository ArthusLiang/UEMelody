/*
* @namespace   UEMelody
* @Author:     yulianghuang
* @CreateDate  2014/12/4
*/
(function(window){
    //ff
	var AudioContext = webkitAudioContext,
		      GetUserMedia =navigator.GetUserMedia || navigator.webkitGetUserMedia|| navigator.mozGetUserMedia|| navigator.msGetUserMedia,
		    VoiceRecognition = webkitSpeechRecognition,
            requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback,el){
                return setTimeout(callback,1000/60);
            };

   	var UEMelody={},
        Core=new function(){
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
        this.define =function(name,deps,factory){
            UEMelody[name] =factory;
        };
   	};

	//class

	//build relationship
    var SmartDic=function(){
    	this.Dic={};

    };
    SmartDic.prototype={
    	//take data from database
    	init:function(data,keyList){
    		//look up some keys from data
    		if(Core.isArray(keyList)){
    			for(var i=0,l=keyList.length;i<l;i++){
    				var _name =keyList[i];
    					_cmd = data[_name];
    				if(_cmd!=null){
    					for(var name in _cmd){
    						this.Dic[name] =_name;
    					}
    				}
    			}
    		//take all
    		}else{
    			for(var _i in data){
    				var _cmd = data[_i];
    				for(var name in _cmd){
    					this.Dic[name] = _i;
    				}
    			}
    		}
    	},
    	get:function(key){
    		return this.Dic[key];
    	},
    	set:function(key,value){
    		this.Dic[key]= value;
    	},
    	remove:function(key,value){
    		if(value != null && this.Dic[key] == value){
    			delete this.Dic[key];
    		}
    	}
    };
    var Learning =function(sessionKey){
    	this.SessionKey = sessionKey;
    	this.load();
    };
    Learning.prototype={
    	load:function(){
    		this.Database ={} || localStorage.getItem(this.SessionKey);
    	},
    	save:function(){
    		localStorage.setItem(sessionKey,this.Database);
    	},
    	learn:function(key,match,dic){
    		 !this.Database[key] && (this.Database[key]={});
    		 if(this.Database[key][match] === undefined){
    		 	this.Database[key][match]=0;
    		 }else{
    		 	this.Database[key][match]++;
    		 }
    		 dic.add(match,key);
    		 save();//not sure
    	},
    	forget:function(key,match,dic){
    		var _obj = this.Database[key];
    		if(_obj !== undefined){
    			delete _obj[match];
    			if(Core.isEmptyObject(_obj)){
    				delete _obj;
    			}
    			dic.remove(key,match);
    		}
    	}
    };


	var Message=function(){
		this.Lib={};//* store handles
		this.Dic={};//  store smart learning dictionary
	};
	Message.prototype={
		bind:function(msg,func) {
			if(!func.$pkid){
				func.$pkid = Core.getPkid();
			}
			var _lib= this.Lib,
				_msg
				_msgs = Core.isArray(msg) ? msg : [msg];
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
			var _msgs = Core.isArray(msg) ? msg : [msg],
				handles;
			for(var i=0,l=_msgs.length;i<l;i++){
				handles = this.Lib[_msgs[i]];
		        if(handles!=undefined && func.$$pkid !=null){
		            delete handles.listeners[func.$$pkid];
		        }
			}
		},
		on:function(msg) {
			if(this.Lib[msg] === undefined && this.Dic){
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

    /*
    * @namespace   SonicVisual
    * @Author:     yulianghuang
    * @CreateDate  2014/12/4
    * @Desciption  Use sound to transform data
    */
    (function(){

    })();

    /*
    * @namespace   Sonic
    * @Author:     yulianghuang
    * @CreateDate  2014/12/4
    * @Desciption  Use sound to transform data
    */
	(function(window){
        //Buff
        var SonicBuff = function(len){
            this.Data=[];
            this.MaxLen=len;
        };
        SonicBuff.prototype={
            get:function(index){
                return this.Data[index] || null;
            },
            last:function(){
                return this.Data[this.Data.length-1] || null;
            },
            add:function(val){
                this.Data.push(val);
                if(this.Data.length>this.MaxLen){
                    this.Data.shift();//this.Data.splice(0,1)
                }
            },
            length:function(){
                return this.Data.length;
            },
            clear:function(){
                this.Data=[];
            },
            copy:function(){
                var _copy = new SonicBuff(this.MaxLen);
                _copy.Data = this.Data.slice(0);
                return _copy; //instead for loop
            },
            remove:function(index,length){
                if(0<=index && index<this.MaxLen-1){
                    this.Data.splice(index,length);
                }
            }
        };

        //SonicCoder
        var SonicCoder=function(opt){
            opt = opt || {};

            //this.CharDic= opt.CharDic || '\n abcdefghijklmnopqrstuvwxyz0123456789,.!?@*';
            this.CharDic= opt.CharDic || '0123456789';
            this.CharStart = opt.CharStart || '^';
            this.CharEnd = opt.CharEnd || '$';
            this.Dic = this.CharStart +this.CharDic + this.CharEnd;
            this.DicLength = this.Dic.length;

            this.FreqMin = opt.FreqMin || 20000;
            this.FreqMax = opt.FreqMax || 22000;
            this.FreqError = opt.FreqError || 50;
            this.FreqStep =(this.FreqMax-this.FreqMin)/ this.DicLength;

        };
        SonicCoder.prototype={
            charToFreq:function(char){
                var _index= this.Dic.indexOf(char);
                if(_index == -1){
                    console.error(char,'is an invalid character.');
                    _index = this.DicLength-1;
                }
                return this.FreqMin + Math.round(this.FreqStep * _index);
            },
            freqToChar:function(freq){
                if(this.FreqMin>freq || this.FreqMax<freq){
                    if(this.FreqMin -freq < this.FreqError){
                        freq = this.FreqMin;
                    }
                    else if(freq-this.FreqMax >this.FreqError){
                        freq = this.FreqMax;
                    }else{
                        console.error(freq, 'is out of range.');
                        return null;
                    }
                }
                return this.Dic[Math.round((freq-this.FreqMin)/this.FreqStep)];
            }
        };


        var SonicSender=function(audioContext,coder,opt){
            opt = opt || {};
            this.AudioContext = audioContext;
            this.Coder = coder;
            this.charDuration =  opt.charDuration || 0.2;
            this.rampDuration = opt.rampDuration || 0.001;
        };
        SonicSender.prototype={
            send:function(msg,callback){
                var freq,time;
                msg  = this.Coder.CharStart + msg + this.Coder.CharEnd;
                for(var i=0;i<msg.length;i++){
                    freq =  this.Coder.charToFreq(msg[i]);
                    time = this.AudioContext.currentTime + this.charDuration*i;
                    this.scheduleToneAt(freq,time,this.charDuration);
                }
                if(callback){
                    setTimeout(callback,this.charDuration*msg.length*1000);
                }
            },
            scheduleToneAt:function(freq,startTime,duration){
                var gainNode = this.AudioContext.createGain(),
                    osc  = this.AudioContext.createOscillator();

                gainNode.gain.value=0;
                gainNode.gain.setValueAtTime(0,startTime);
                gainNode.gain.linearRampToValueAtTime(1,startTime+this.rampDuration);
                gainNode.gain.setValueAtTime(1,startTime+duration-this.rampDuration);
                gainNode.gain.linearRampToValueAtTime(0,startTime+duration);

                osc.frequency.value = freq;

                gainNode.connect(this.AudioContext.destination);
                osc.connect(gainNode);
                osc.start(startTime);
            }
        };

        var S_STATE={
            IDLE:1,
            RECV:2
        };

        var SonicAccepter=function(audioContext,coder,opt){
            opt = opt || {};
            this.AudioContext = audioContext;
            this.Coder = coder;


            this.PeakThreshold = opt.PeakThreshold || -65;
            this.MinRunLength = opt.MinRunLength || 2;
            this.Timeout = opt.Timeout || 300;
            this.DebugCanvas = opt.Canvas || 'SonicDebugCanvas';

            this.PeakHistory = new SonicBuff(16);
            this.PeakTimes = new SonicBuff(16);

            this.Callbacks= {};

            this.Buffer='';
            this.State =S_STATE.IDLE;
            this.Iteration =0;

            this.IfDebug = !!opt.IfDebug;
            this.IsRunning =false;

        };


        SonicAccepter.prototype = new Message();
        SonicAccepter.prototype.constructor=SonicAccepter;

        Core.extend(SonicAccepter.prototype,{
            start:function(){
                var me =this;
                navigator.webkitGetUserMedia({
                    audio:{optional:[{echoCancellation:false}]}
                },function(stream){
                    me.onStream(stream);
                },function(e){
                    me.onStreamError(e);
                });
            },
            stop:function(){
                this.IsRunning = false;
                this.Stream.stop();
            },
            /*
            on:function(event,callback){
                if(event == 'message'){
                    this.Callbacks.message = callback;
                }
            },
            fire:function(callback,arg){
                callback(arg);
            },
            */
            setDebug:function(value){
                this.debug = value;
                var canvas =document.getElementById(this.DebugCanvas);
                if(canvas){
                    canvas.parentNode.removeChild(canvas);
                }
            },
            onStream:function(stream){
                var me =this,
                    _input = me.AudioContext.createMediaStreamSource(stream),
                    _analyser = me.AudioContext.createAnalyser();

                _input.connect(_analyser);
                me.Freqs = new Float32Array(_analyser.frequencyBinCount);
                me.Analyser = _analyser;
                me.Stream = stream;
                me.IsRunning = true;
                me.raf(function(){
                    me.loop();
                });
            },
            onStreamError:function(e){
                console.error('Audio input error:',e);
            },
            loop:function(){
                var me =this;
                //get data
                me.Analyser.getFloatFrequencyData(me.Freqs);
                //do sanity check the peaks every 5 seconds
                if((me.Iteration+1)%(60*5)==0){
                    me.restartServerIfSanityCheckFails();
                }
                var peakFreq = me.getPeakFrequency();
                if(peakFreq){
                    var char = me.Coder.freqToChar(peakFreq);
                    //debug
                    if(me.IfDebug){
                        console.log('Transcribed char:'+ char);
                    }
                    me.PeakHistory.add(char);
                    me.PeakTimes.add(new Date());
                }else{
                    //no character was detected
                    var lastPeakTime = me.PeakTimes.last();
                    if(lastPeakTime && new Date() - lastPeakTime > me.Timeout){
                        me.State = S_STATE.IDLE;
                        if(me.IfDebug){
                            console.log('Token',me.buffer,'timed out');
                        }
                        me.PeakTimes.clear();
                    }
                }
                //
                me.analysePeaks();
                if(me.IfDebug){
                    me.debugDraw();
                }
                if(me.IsRunning){
                    me.raf(function(){
                        me.loop();
                    });
                }
                me.Iteration+=1;

            },
            getPeakFrequency:function(){ //get the max signal in the frequent brand
                var me=this,
                    _start = me.freToIndex(me.Coder.FreqMin),
                    _max = - Infinity,
                    _index=-1;
                for(var i=_start;i<me.Freqs.length;i++){
                    if(me.Freqs[i] > _max){
                        _max = me.Freqs[i];
                        _index=i;
                    }
                }
                //in case
                if(_max>me.PeakThreshold){
                    return me.indexToFreq(_index);
                }
                return null;
            },
            //to be analyized
            indexToFreq:function(index){ //频域信号
                //采样频率sampleRate，定义了每秒从连续信号中提取并组成离散信号的采样个数，它用赫兹（Hz）来表示。
                var nyquist = this.AudioContext.sampleRate/2;  // B=2W -> W=B/2 其中，W为理想低通信道的带宽，单位是赫兹（Hz） ;单位为"波特",常用符号"Baud"表示，简写为"B"。
                return nyquist/this.Freqs.length*index;

            },
            freToIndex:function(freq){
                var nyquist = this.AudioContext.sampleRate/2;
                return Math.round(freq/nyquist*this.Freqs.length);
            },
            analysePeaks:function(){
                var char = this.getLastRun();
                if(!char){
                    return;
                }
                if(this.State == S_STATE.IDLE){
                    if(char == this.Coder.CharStart){
                        this.buffer='';
                        this.State = S_STATE.RECV;
                    }
                }else if(this.State == S_STATE.RECV){
                    if(char != this.lastChar && char != this.Coder.CharStart && char != this.Coder.CharEnd){
                        this.buffer +=char;
                        this.lastChar = char;
                    }
                    if(char == this.Coder.CharEnd){
                        this.State = S_STATE.IDLE;
                        this.on(this.buffer);
                        //this.fire(this.Callbacks.message,this.buffer);
                        this.buffer='';
                    }
                }
            },
            getLastRun:function(){
                var me=this,
                             lastChar = this.PeakHistory.last(),
                    runLength=0;
                for(var i=this.PeakHistory.length()-2;i>=0;i--){
                    var char = this.PeakHistory.get(i);
                    if(char == lastChar){
                        runLength+=1;
                    }else{
                        break;
                    }
                }
                if(runLength > me.MinRunLength){
                    me.PeakHistory.remove(i+1,runLength+1);
                    return lastChar;
                }
                return null;

            },
            debugDraw:function(){
                var me=this,
                    canvas = document.getElementById(me.DebugCanvas);
                if(!canvas){
                    canvas = document.createElement('CANVAS');
                    canvas.id=me.DebugCanvas;
                    document.body.appendChild(canvas);
                }
                canvas.width = 800;
                canvas.height=480;
                var _drawContext = canvas.getContext('2d'),
                    _barWidth = canvas.width/me.Freqs.length;
                _drawContext.fillStyle ='black';
                _drawContext.moveTo(0,me.Freqs[0]);
                //draw
                for(var i=1;i<me.Freqs.length;i++){
                    _drawContext.lineTo(i*_barWidth,me.Freqs[i]+200);
                }
                _drawContext.stroke();
            },
            raf:function(callback){
                var isCrx = !!(window.chrome && chrome.extension);
                if(isCrx){
                    setTimeout(callback,1000/60);
                }else{
                    requestAnimationFrame(callback);
                }
            },
            restartServerIfSanityCheckFails:function(){
                var me =this;
                //strange state 1: peaks gradually get quieter and quieter until they stabilize around -800
                if(me.Freqs[0] < -300){
                    console.error('freqs[0] < -300. Restarting.');
                    me.restart();
                    return;
                }
                //strange state 2: all of the peaks are -100.Check just the first few.
                var _isValid = true;
                for(var i=0;i<10;i++){
                    if(me.Freqs[i] ==-100){
                        _isValid=false;
                    }
                }
                if(!_isValid){
                    console.error('fregs[0:10] == -100. Restarting');
                    me.restart();
                }
            },
            restart:function(){
                window.location.reload();
            }
        });

        var Sonic=function(opt){
            this.AudioContext = window.audioContext || new webkitAudioContext();
            this.Coder = new SonicCoder(opt);
        };
        Sonic.prototype={
            createSender:function(opt){
                var _sender=new SonicSender(this.AudioContext, this.Coder,opt);
                this.Sender = _sender;
                return _sender;
            },
            createAccepter:function(opt){
                var _accepter = new SonicAccepter(this.AudioContext, this.Coder,opt);
                this.Accepter = _accepter;
                return _accepter;
            }
        };

        if(typeof window.define === 'function'){
            define([],function(){
                return Sonic;
            });
        }else{
            window.Sonic = Sonic;
        }

	})(window);

    /*
    * @namespace   MyVoix
    * @Author:     yulianghuang
    * @CreateDate  2014/12/8
    * @Desciption  Change sound to language
    */
	(function(window){
		var _sessionKey='myVoixData';

		var MyVoix=function(config,keyList,isLoop){
			this.SmartLearning = new Learning(_sessionKey);
			this.Dic= new SmartDic(this.SmartLearning,keyList);
			this.Dic.init();
			this.createRecognition(config);
			this.IsLoop = isLoop;
			//this.CurrentLearning=undefined;
			this.Recognition.start();
			//can be override
			this.onLearning=function(key){};
			this.onLog=function(msg){};
		};

		//inherit class message
		MyVoix.prototype = new Message();
		MyVoix.prototype.constructor=MyVoix;

		//add its own functions here
		Core.extend(MyVoix.prototype,{
			createRecognition:function(config){
				this.Recognition = new VoiceRecognition();
				var _default={
					continuous:true,
					interimResults:false,
					lang:'en-US',
					maxAlternatives:1
				};
				Core.extend(_default,config,true);
				Core.extend(this.Recognition,_default,true);
				/*
				Recognition has the following functions to be override
				onstart,onresult,onerror,onend
                */
			},
			start:function(){
				var me = this;
				me.Recognition.onresult=function(e){
					me._result.call(me,e);
				};
				return me;
			},
			stop:function(){
				this.Recognition.onresult = undefined;
				return this;
			},
			startLearning:function(word){
				this.CurrentLearning=word;
			},
			stopLearning:function(){
				this.CurrentLearning=undefined;
			},
			_result:function(e){
				var me =this,
				reg=/^\s+|\s+$/g,
				len = e.results.length,
				i=e.resultIndex,
				j=0,
				listeners,//funcs
				msg;
				me.stop();
				for(;i<len;i++){
					if(e.results[i].isFinal){
						//get word
						msg = e.results[i][0].transcript.replace(reg,' ').toLowerCase();
						console.log(msg);
						me.onLog(msg);
					}
					if(me.CurrentLearning){
						this.SmartLearning.learn(me.CurrentLearning,msg,me.Dic);
					}else{
						if(me.Lib[msg] === undefined){
							msg = me.Dic.get(msg);
						}
						if(msg && me.Lib[msg]){
							listeners = me.Lib[msg].listeners;
							for(var name in listeners){
								listeners[name].call();
							}
						}
					}
				}
				me.IsLoop && me.start();
			},
			createSoundWave:function(config){

			}
		});

        //AMD
        Core.define('MyVoix',[],MyVoix);

	})(window);

    //define
    if(typeof window.define === 'function'){
        define([],function(){
            return UEMelody;
        });
    }else{
        window.UEMelody = UEMelody;
    }

})(window);