(function(window){
	//Core
	var global_pkid=0,
		getGlobalPkid=function(){
			return global_pkid;	
		},
		isArray=function (pObj) {
        	return Object.prototype.toString.call(pObj) === '[object Array]';
        };

    var SmartDic=function(){
    	this.Dic={};

    };
    SmartDic.prototype={
    	init:function(){

    	},
    	get:function(){

    	},
    	set:function(){

    	},
    	remove:function(){

    	}
    }

	//class
	var Message=function(){
		this.Lib={};//* store handles
		this.Dic={};//  store smart learning dictionary
	};	
	Message.prototype={
		bind:function(msg,func) {
			if(!func.$pkid){
				func.$pkid = getGlobalPkid();
			}
			var _lib= this.Lib,
				_msg
				_msgs = isArray(msg) ? msg : [msg];
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
			var _msgs = isArray(msg) ? msg : [msg],
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
	}
})(window);