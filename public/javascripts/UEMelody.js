/*
* @namespace   UEMelody
* @Author:     yulianghuang 
* @CreateDate  2014/12/4
*/
(function(window){
<<<<<<< HEAD
	var AudioContext = webkitAudioContext,
		GetUserMedia = webkitGetUserMedia,
		VoiceRecognition = webkitSpeechRecognition;

=======
>>>>>>> FETCH_HEAD
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

	var SoundWave=function(){

	};
	SoundWave.prototype=function(){

	};

	//speech recognition
	(function(window){
		var _sessionKey='myVoixData',
			_voiceRecognition = window.webkitSpeechRecognition;

		var MyVoix=function(config,keyList,isLoop){
			var _smartLearning = new Learning(_sessionKey);
			this.Dic= new SmartDic(_smartLearning,keyList);
			this.Dic.init();
			this.createRecognition(config);
			this.IsLoop = isLoop;
			this.CurrentLearning=undefined;
			this.Recognition.start();
			//
			this.onLearning=function(key){};
			this.onlog=function(msg){};
		};	
		MyVoix.prototype = new Message();
		MyVoix.prototype.constructor=MyVoix;
		Core.extend(MyVoix.prototype,{
			createRecognition:function(config){
				this.Recognition = new _voiceRecognition();
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
			}
		});


	})(window);

})(window);