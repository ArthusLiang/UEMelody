var ctx = new webkitAudioContext(),
    _input,
    _analyser = ctx.createAnalyser(),
    Data_FF= new Float32Array(_analyser.frequencyBinCount),
    rate={
        '216':1000000000/(216*93.75)/(216*93.75),
        '221':1000000000/(221*93.75)/(221*93.75),
        '226':1000000000/(226*93.75)/(226*93.75),
        '231':1000000000/(231*93.75)/(231*93.75)
    };
_analyser.smoothingTimeConstant = 0.3;
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
    logMax=function(arr){
        return arr[0]>arr[1]?0:1;
    },
    requestAnimationFrame3=function(func,interval){
        var _start = new Date(),
            _ob={},
            _num=0,
            _now,
            _range,
            _distance,
            _p1=[0,0],
            _p2=[0,0],
            _pos= interval*0.8;
        canrequest = true;
        //console.log(_start.getSeconds(),_start.getMilliseconds());
        var _callback=function(){
            _now= new Date();
            _distance = _now-_start;
            _analyser.getFloatFrequencyData(Data_FF);

            i1=comparePeak(216,221);
            i2=comparePeak(226,231);

            if(_distance%interval > _pos){
                _range = _distance/interval>>0;
                if(_ob[_range]===undefined){
                    _ob[_range] = 1;
                    _num++;
                    console.log(logMax(_p1),logMax(_p2));
                    //.....do func
                    _p1=[0,0];
                    _p2=[0,0];
                    //console.log(_now.getSeconds(),_now.getMilliseconds());
                }
                if(_num===1000){
                    _num=0;
                    _start.setSeconds(_start.getSeconds()+interval);
                    //setSeconds()
                    _ob={};
                }

            }
            _p1[i1]++;
            _p2[i2]++;
            canrequest && requestAnimationFrame(_callback);
        };
        _callback();
    },
    i1,i2,i3,i4,
    IsReceiving=false,
    startIDL='11111111',
    endIDL='000000000000',
    stack='0000000000000000',
    comparePeak=function(One,Zero){
        return Data_FF[Zero]>Data_FF[One]? 0:1;
        //return Data_FF[Zero]/rate[Zero]>Data_FF[One]/rate[One]? 0:1;
    },
    scan=function(){
        console.log('scan data');
        _analyser.getFloatFrequencyData(Data_FF);
        //i1= getInfo2(Data_FF,214,216,218);
        //i2= getInfo2(Data_FF,219,221,223);
        //i3= getInfo2(Data_FF,224,226,228);
        //i4= getInfo2(Data_FF,229,231,233);

        i1=comparePeak(216,221);
        i2=comparePeak(226,231);

        stack = stack.substring(2).concat(i1,i2);
        console.log(i1,i2);
        if(IsReceiving){
            if(endIDL===stack.substring(12)){
                IsReceiving=false;
                stack='0000000000000000';
                cancelRequestAnimationFrame2();
                scanEnvironment();
            }
        }else if(stack.substring(8) === startIDL && i1=== 0){
            IsReceiving=true;
        }

    },
    scanEnvironment=function(){
        _analyser.getFloatFrequencyData(Data_FF);
        i1= getInfo(Data_FF,214,216,218);
        i3= getInfo(Data_FF,224,226,228);
        if(i1 && i3 ){
            requestAnimationFrame3(function(){
                scan();
            },500);
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
        scanEnvironment();
    },function(e){});

};