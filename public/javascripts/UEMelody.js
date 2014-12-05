/*
* @namespace   UEMelody
* @Author:     yulianghuang
* @CreateDate  2014/12/4
*/
(function(window){
	var AudioContext = webkitAudioContext,
		GetUserMedia = webkitGetUserMedia,
				VoiceRecognition = webkitSpeechRecognition;

   	var Core=new function(){
		var _pkid=0;
	   	/*
        * Get the global pkid
        * @return {number}
        */
		this.getPkid=function(){
			return _pkid;
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

	var SoundCanvas=function(){

	};
	SoundCanvas.prototype={
		attachSource:function(context,audioInput){

		},
		newlistener:function(){

		}
	}

	var SoundWave=function(){

	};
	SoundWave.prototype={

	};

	//ultrasound
	(function(window){

	})(window);

	//speech recognition
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
			}
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
		if(typeof window.define === 'function'){
			define([],function(){
				return MyVoix;
			});
		}else{
			window.MyVoix = MyVoix;
		}

	})(window);

})(window);