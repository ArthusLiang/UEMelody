var ctx = new webkitAudioContext(),
    _input,
    _analyser = ctx.createAnalyser(),
    Data_FF= new Float32Array(_analyser.frequencyBinCount);

MaxSign={
    '216':0,
    '221':0,
    '226':0,
    '231':0
};
MinSign={
    '216':100000,
    '221':100000,
    '226':100000,
    '231':100000
};

window.onload=function(){

    var _board = document.getElementById('board');
    var getInfo=function(data,start,peak,end){
        var i,range=data[peak]-data[start];
        if(range<15){
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
        if(range>MaxSign[peak]){
            MaxSign[peak]=range;
        }
        if(range<MinSign[peak]){
            MinSign[peak]= range;
        }
        return 1;
    },
    getInfo2=function(data,start,peak,end){
        var i,range=data[peak]-data[start]>>0;
        console.log(peak,[data[start]>>0,data[start+1]>>0,data[peak]>>0,data[peak+1]>>0,data[end]>>0].join('  '),range);
        if(range<15){
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
    canrequest=true,
    cancelRequestAnimationFrame2=function(){
        canrequest = false;
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
        //console.log(_start.getSeconds(),_start.getMilliseconds());
        var _callback=function(){
            _now= new Date();
            _distance = _now-_start;
            if(_distance%interval > _pos){
                _range = _distance/interval>>0;
                if(_ob[_range]===undefined){
                    _ob[_range] = 1;
                    _num++;
                    func();
                    //console.log(_now.getSeconds(),_now.getMilliseconds());
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
    scan=function(){
        _analyser.getFloatFrequencyData(Data_FF);
        i1= getInfo2(Data_FF,214,216,218);
        i2= getInfo2(Data_FF,219,221,223);
        i3= getInfo2(Data_FF,224,226,228);
        i4= getInfo2(Data_FF,229,231,233);
        var _now = new Date();
        stack = stack.substring(4).concat(i1,i2,i3,i4);
        console.log([_now.getSeconds(),_now.getMilliseconds()].join(':'),[i1,i2,i3,i4].join(''));
        //if(IsReceiving){
            if(endIDL===stack || stack=== '0000000000000000'){
                IsReceiving=false;
                stack='0000000000000000';
                cancelRequestAnimationFrame2();
                scanEnvironment();
            }

        /*
        }else{
            if(startIDL===stack){
                IsReceiving=true;
            }
        }
        */
    },
    scanEnvironment=function(){
        _analyser.getFloatFrequencyData(Data_FF);
        i1= getInfo(Data_FF,214,216,218);
        i2= getInfo(Data_FF,219,221,223);
        i3= getInfo(Data_FF,224,226,228);
        i4= getInfo(Data_FF,229,231,233);
        if(i1 && i2 && i3 && i4){
            requestAnimationFrame2(function(){
                scan();
            },200);
        }else{
            requestAnimationFrame(scanEnvironment);
        }
    },
    scanll=function(){
        _analyser.getFloatFrequencyData(Data_FF);
        i1= getInfo(Data_FF,214,216,218);
        i2= getInfo(Data_FF,219,221,223);
        i3= getInfo(Data_FF,224,226,228);
        i4= getInfo(Data_FF,229,231,233);
        if(i1 || i2 || i3 || i4){
            console.log([i1,i2,i3,i4].join(''));
        }
        requestAnimationFrame(scanll);
    };

    navigator.webkitGetUserMedia({
        audio:{optional:[{echoCancellation:false}]}
    },function(stream){
        _input = ctx.createMediaStreamSource(stream);
        _input.connect(_analyser);
        scanll();
        //scanEnvironment();
    },function(e){});

};