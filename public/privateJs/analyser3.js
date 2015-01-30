var ctx = new webkitAudioContext(),
    _input,
    _analyser = ctx.createAnalyser(),
    Data_FF= new Float32Array(_analyser.frequencyBinCount);

window.onload=function(){

    var _board = document.getElementById('board');
    var getInfo=function(data,start,peak,end){
        var i;
        if(data[peak]-data[start]<7){
            return 0;
        }
        for(i=start;i<peak;i++){
            if(data[i]>=data[i+1]){
                return 0;
            }
        }
        for(i=end;i>peak;i--){
            if(data[i]>data[i-1]){
                return 0;
            }
        }
        return 1;
    },
    requestAnimationFrame2=function(func,interval){
        var _start = new Date(),
            _ob={},
            _num=0,
            _now,
            _range,
            _distance,
            _pos= interval/2;
        canrequest = true;
        console.log(_start.getSeconds(),_start.getMilliseconds());
        var _callback=function(){
            _now= new Date();
            _distance = _now-_start;
            if(_distance%interval > _pos){
                _range = _distance/interval>>0;
                if(_ob[_range]===undefined){
                    _ob[_range] = 1;
                    _num++;
                    func();
                    console.log(_now.getSeconds(),_now.getMilliseconds());
                }
                if(_num===1000){
                    _num=0;
                    _start.setSeconds(_start.getSeconds()+interval);
                    //setSeconds()
                    _ob={};
                }
            }
            canrequest && requestAnimationFrame(_callback);
        };
        _callback();
    },
    i1,i2,i3,i4,
    IsReceiving=false,
    startIDL='0000000011111111',
    endIDL='1111111100000000',
    stack='0000000000000000',
    getMaxSign=function(obj){
        var max=0,val;
        for(var name in obj){
            if(obj[name]>max){
                max = obj[name];
                val=name;
            }
        }
        return name;
    },
    scanRange=function(interval){
        var _start = new Date(),
            _ob={},
            _num=0,
            _now,
            _range,
            _distance;

        window._ob = _ob;

        var _callback=function(){
            _now= new Date();
            _distance = _now-_start;
            _range = _distance/interval>>0;

            _analyser.getFloatFrequencyData(Data_FF);
            i1= getInfo(Data_FF,214,216,218);
            i2= getInfo(Data_FF,219,221,223);
            i3= getInfo(Data_FF,224,226,228);
            i4= getInfo(Data_FF,229,231,233);
            var str=[i1,i2,i3,i4].join('');

            if(_ob[_range]===undefined){
                _ob[_range] = {};
                _num++;
                //deal last val
                if(_ob[_range-1]!=null){
                    var _preval= getMaxSign(_ob[_range-1]);
                    console.log(_preval);
                    stack = stack.substring(4).concat(_preval);
                    /*
                    if(IsReceiving){
                        if(endIDL===stack || stack=== '0000000000000000'){
                            IsReceiving=false;
                            stack='0000000000000000';
                            scanEnvironment();
                            return;
                        }
                    }else{
                        if(startIDL===stack){
                            IsReceiving=true;
                        }
                    }
                    */
                    if(endIDL===stack || stack=== '0000000000000000'){
                        IsReceiving=false;
                        stack='0000000000000000';
                        scanEnvironment();
                        return;
                    }
                    //console.log(_preval);
                }
            }
            if(_ob[_range][str]== null){
                _ob[_range][str] = 0;
            }else{
                _ob[_range][str]++;
            }
            if(_num===1000){
                _num=0;
                _start.setSeconds(_start.getSeconds()+interval);
                _ob={};
            }
            requestAnimationFrame(_callback);
        };
        _callback();
    },
    scanEnvironment=function(){
        _analyser.getFloatFrequencyData(Data_FF);
        i1= getInfo(Data_FF,214,216,218);
        i2= getInfo(Data_FF,219,221,223);
        i3= getInfo(Data_FF,224,226,228);
        i4= getInfo(Data_FF,229,231,233);
        if(i1 && i2 && i3 && i4){
            scanRange(500);
        }else{
            requestAnimationFrame(scanEnvironment);
        }
    };

    navigator.webkitGetUserMedia({
        audio:{optional:[{echoCancellation:false}]}
    },function(stream){
        _input = ctx.createMediaStreamSource(stream);
        _input.connect(_analyser);
        scanEnvironment();
    },function(e){});

};