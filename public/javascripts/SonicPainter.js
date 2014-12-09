(function(){
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

    /*
    * @namespace   SonicPainter
    * @Author:     yulianghuang
    * @CreateDate  2014/12/8
    * @Desciption  paint sound
    */
    (function(){
        var painters=new function(){

            var _defaultColor='#00aff5';
            var hex2rgb=function(hex){
                var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                hex = hex.replace(shorthandRegex, function(m,r,g,b){ return r + r + g + g + b + b;});
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? parseInt(result[1],16).toString()+','+parseInt(result[2], 16).toString()+','+parseInt(result[3], 16).toString(): null;
            },
            mergeConfig=function(option,config,callback){
                if(!config.If1st){
                    Core.extend(config,option,false);
                    config.If1st=true;
                    callback && callback();
                }
            },
            getAverage=function(arr,start,end){
                var sum=0,
                    start = start || 0,
                    end = end || arr.length;
                for(var i=start;i<end;i++){
                    sum+=arr[i];
                }
                return sum/(end-start);
            };

            //public function
            this.line=function(canvas,data,config){
                mergeConfig({
                    X1:0,
                    X2:canvas.width,
                    XStep:4,
                    YMid:canvas.height/2,
                    YAdjust:-100,
                    StrokeStyle:_defaultColor,
                    LineWidth :2
                },config,function(){
                    config._stepWidth = (config.X2-config.X1)/data.length;
                    config._base = config.YAdjust+config.YMid;
                });

                var _ctx = canvas._context,
                    _step =config.XStep,
                    _base = config._base,
                    _stepWidth =  config._stepWidth;
                _ctx.strokeStyle = config.StrokeStyle;
                _ctx.lineWidth =config.LineWidth;
                _ctx.moveTo(config.X1,_base-data[0]);
                for(var i=_step,l=data.length;i<l;i+=_step){
                    _ctx.lineTo(i*_stepWidth,_base-data[i]);
                }
                _ctx.stroke();
            };

            this.rectangle=function(canvas,data,config){
                mergeConfig({
                    X1:0,
                    X2:canvas.width,
                    XNum:64,
                    XGap:4,
                    YMid:canvas.height/2,
                    YAdjust:-100,
                    FillStyle:_defaultColor
                },config,function(){
                    config._dataWidth=data.length/config.XNum;
                    config._stepWidth=(config.X2-config.X1)/config.XNum;
                    config._rectWidth= Math.floor(config._stepWidth-config.XGap);
                    config._base = config.YAdjust+config.YMid;
                })
                var _ctx = canvas._context,
                    _dataWidth = config._dataWidth,
                    _stepWidth = config._stepWidth,
                    _rectWidth = config._rectWidth,
                    _base =config._base,
                    _xNum = config.XNum,
                    _xGap = config.XGap/2,
                    _y,
                    i,j,loc,sum;

                _ctx.fillStyle = config.FillStyle;
                for(i=0;i<_xNum;i+=1){
                    loc =i*_dataWidth;
                    sum=0;
                    for(j=0;j<_dataWidth;j++){
                        sum+=data[loc+j];
                    }
                    _y=_base-sum/_dataWidth;
                    _ctx.fillRect(i*_stepWidth+_xGap,_y,_rectWidth,canvas.height-_y);
                }
            };

            //siri wave line
            var _wave_drawline=function(canvas,config,index){
                var _ctx = canvas._context,
                    _attenuation = config.Attenuation[index],
                    x,y;
                _ctx.strokeStyle = ['rgba(', config.StrokeStyle,',',_attenuation[1],'-)'].join('');
                _ctx.lineWidth = _attenuation[2];
                _ctx.stroke();
            };
            this.wave=function(canvas,data,config){
                mergeConfig({
                    Attenuation:[[-2,0.1,1],[-6,0.2,1],[4,0.4,1],[2,0.6,1],[1,1,1.5]],
                    K:2,
                    Phase:0,
                    Noise:1,
                    Speed:0.1,
                    Alpha:0.8,
                    F:2,
                    Max:canvas.height/2-4,
                    StrokeStyle:hex2rgb(_defaultColor)
                },config);
                var _average = getAverage(data),
                    _alpha = config.Alpha;

                //set arguments with data
                if(_average>0){
                    var _now = _noise;
                    config.Noise = Math.min(_alpha * config.Noise + (1-_alpha) * (_average*10),1);
                    config.F = 2+(_average/100) * 3;
                }

                for(var i=0,l=_attenuationArr.length;i<l;i++){
                    _wave_drawline(canvas,config,i);
                }
            };

            this.cricle=function(canvas,data,config){
                mergeConfig({

                },config)
                var _ctx = canvas._context;
            };

        };

        var SonicPainter = function(){
            this.CanvasList = {};
            this.AnalyserList = {};
            this.IfRender = false;
        };

        SonicPainter.prototype={
            _initObj:function(obj,storeName){
                //!obj.UEMelodyID && (obj.UEMelodyID = Core.getPkid());
                if(!obj.UEMelodyID){
                    obj.UEMelodyID = Core.getPkid();
                    obj.UEMelodyArr ={};
                    obj.IfRender =true;
                }
                var _storeList = this[storeName];
                if(!_storeList[obj.UEMelodyID]){
                    _storeList[obj.UEMelodyID]=obj;
                }
            },
            _matchObj:function(obj,sbj,renderObj){
                obj.UEMelodyArr[sbj.UEMelodyID]=renderObj;
                sbj.UEMelodyArr[obj.UEMelodyID]=renderObj;
            },
            dematchObj:function(obj,sbj){
                delete obj.UEMelodyArr[sbj.UEMelodyID];
                delete sbj.UEMelodyArr[obj.UEMelodyID];
            },
            attach:function(canvas,analyser,renderObj){
                var me = this;
                me._initObj(canvas,'CanvasList');
                me._initObj(analyser,'AnalyserList');
                me._matchObj(canvas,analyser,renderObj);
                canvas._context = canvas.getContext('2d');
                analyser.UEMelodyData = new Float32Array(analyser.frequencyBinCount);
            },
            clearCanvas:function(canvas){
                /* clearRect not work...oh my god
                var _ctx = canvas._context;
                 _ctx.globalCompositeOperation = 'destination-out';
                 _ctx.clearRect(0,0,canvas.width,canvas.height);
                 _ctx.globalCompositeOperation = 'source-over';
                 */
                 canvas.width=canvas.width;
            },
            _drawCanvas:function(canvas){
                if(canvas.IfRender){
                    this.clearCanvas(canvas);
                    var _analyserList = this.AnalyserList,
                        _arr=canvas.UEMelodyArr,
                        _analyserNode,
                        _renderObj;
                    for(var id in _arr){
                        //global function
                        _analyserNode=_analyserList[id];
                        _renderObj =_arr[id];
                        _analyserNode.IfRender && painters[_renderObj.func](canvas,_analyserNode.UEMelodyData,_renderObj.config);
                    }
                }
            },
            //start here
            _render:function(){
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
                        me._drawCanvas(_canvasList[id]);
                    }
                    requestAnimationFrame(function(){
                        me._render();
                    });
                }
            },
            start:function(objs){
                this._setIfRender(objs,true);
                this._render();
            },
            stop:function(objs){
                this._setIfRender(objs,false);
            },
            _setIfRender:function(objs,ifRender){
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
        //export
        window.SonicPainter = SonicPainter;

    })();

})();