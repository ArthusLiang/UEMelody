(function(){
    //ff
    var AudioContext = webkitAudioContext,
        GetUserMedia = webkitGetUserMedia,
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
            this.define =function(name,deps,factory){
                UEMelody[name] =factory;
            };
        };

    /*
    * @namespace   SonicPainter
    * @Author:     yulianghuang
    * @CreateDate  2014/12/8
    * @Desciption  paint sound
    */
    (function(){
        var painters={
            line:function(canvas,data,config){
                if(config.If1st){

                }
                var _ctx = canvas._contenxt;
            },
            rectangle:function(canvas,data,config){

            },
            round:function(canvas,data,config){

            }
        };

        var SonicPainter = function(){
            this.CanvasList = {};
            this.AnalyserList = {};
            this.IfRender = false;
        };
        SonicPainter.prototype=function(){
            initObj:function(obj,storeName){
                //!obj.UEMelodyID && (obj.UEMelodyID = Core.getPkid());
                if(!obj.UEMelodyID){
                    obj.UEMelodyID = Core.getPkid();
                    obj.UEMelodyArr ={};
                    obj.IfRender =true;
                }

                var _storeList = this[storeName];
                if(!_storeList[obj.UEMelodyID]){
                    _storeList[obj.UEMelodyID]==obj;
                }
            },
            matchObj:function(obj,sbj,renderObj){
                obj.UEMelodyArr[sbj.UEMelodyID]=renderObj;
                sbj.UEMelodyArr[obj.UEMelodyID]=renderObj;
            },
            dematchObj:function(obj,sbj){
                delete obj.UEMelodyArr[sbj.UEMelodyID];
                delete sbj.UEMelodyArr[obj.UEMelodyID];
            },
            attach:function(canvas,analyser,renderObj){
                var me = this;
                this.initObj(canvas,'CanvasList');
                this.initObj(analyser,'AnalyserList');
                matchObj(canvas,analyser,renderObj);
                canvas._contenxt = canvas.getContext('2d');
                analyser.UEMelodyData = new Float32Array(analyser.frequencyBinCount);
            },
            clearCanvas:function(canvas){
                canvas._contenxt.clearRect(0,0,canvas.width,canvas.height);
            },
            drawCanvas:function(canvas){
                if(canvas.IfRender){
                    clearCanvas(canvas);
                    var _analyserList = this.AnalyserList,
                        _arr=canvas.UEMelodyArr,
                        _analyserNode,
                        _renderObj;
                    for(var id in _arr){
                        //global function
                        _analyserNode=_analyserList[id];
                        _renderObj =_arr[id];
                        _analyserNode.IfRender && painters(_renderObj.func)(canvas,_analyserNode.UEMelodyData,_renderObj.config);
                    }
                }
            },
            render:function(){
                if(this.IfRender){
                    //prepare data
                    var me=this,
                        _analyserList = me.AnalyserList,
                        _canvasList = me.CanvasList,
                        _canvas;
                    for(var id in _analyserList){
                        _analyserList[id].getFloatFrequencyData(_analyserList[id].UEMelodyData);
                    }
                    //drawCanvas
                    for(var id in _canvasList){
                        me.drawCanvas(_canvasList[id]);
                    }
                    requestAnimationFrame(function(){
                        me.render();
                    });
                }
            },
            start:function(objs){
                this.setIfRender(obj,true);
            },
            stop:function(objs){
                this.setIfRender(obj,false);
            },
            setIfRender:function(objs,ifRender){
                if(objs){
                    if(Core.isArray(objs)){
                        for(var id in objs){
                            objs[id].IfRender =ifRender
                        }
                    }else{
                        objs.IfRender =ifRender;
                    }
                }else{
                    this.IfRender=ifRender;
                }
            }
        };
    })();

})();