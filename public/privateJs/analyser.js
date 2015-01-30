(function(){
    var ctx = new AudioContext(),
        _input,
        _analyser = ctx.createAnalyser(),
        _sampleRate = ctx.sampleRate,
        Data_FF= new Float32Array(_analyser.frequencyBinCount),
        Data_BF= new Uint8Array(_analyser.frequencyBinCount);

    _analyser.smoothingTimeConstant = 0.3;

    var _base1 = _sampleRate/2/_analyser.frequencyBinCount;
    var GetMax = function(arr){
        var max = -Infinity,
            rt,i,l,hz=[];
        for(i=214,l=236;i<l;i++){
            if(arr[i]>max){
                max =arr[i];
                rt=[i];
            }else if(arr[i]=== max){
                rt.push[i];
            }
        }

        for(i=0,l=rt.length;i<l;i++){
            hz.push(_base1*rt[i]);
        }

        return {
            Val:max,
            Index:rt,
            Hz:hz
        }
    },
    getInfo=function(data,start,peak,end){
        var i,l;
        if(data[peak]-data[start]<10){
            return 0;
        }
        for(i=start;i<peak;i++){
            if(data[i]>=data[i+1]){
                return 0;
            }
        }
        for(i=peak,l=end-1;i<l;i++){
            if(data[i]<=data[i+1]){
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
            _range;
        var _callback=function(){
            _now= new Date();
            _range = (_now-_start)/interval>>0;
            if(_ob[_range]===undefined){
                _ob[_range] = 1;
                _num++;
                func();
            }
            if(_num===1000){
                _num=0;
                _start.setSeconds(_start.getSeconds()+interval);
                //setSeconds()
                _ob={};
            }
            requestAnimationFrame(_callback);
        };
        _callback();
    },
    WatchChannel=function(val){
        var _index = val/(_sampleRate/2)* _analyser.frequencyBinCount,
            _str=['Channel:',val,' Index:',_index,' FF:',Data_FF[_index],'<br>'];
        return _str.join(' ');
    };




    navigator.webkitGetUserMedia({
        audio:{optional:[{echoCancellation:false}]}
    },function(stream){
        _input = ctx.createMediaStreamSource(stream);
        //_lowpass = ctx.createBiquadFilter('lowpass'),
        //_highpass = ctx.createBiquadFilter('highpass');
        //_lowpass.frequency=21050;
        //_highpass.frequency=20950;

        //_input.connect(_lowpass);
        //_lowpass.connect(_highpass);
        _input.connect(_analyser);

    },function(e){});

    window.onload=function(){
        var _board = document.getElementById('board'),
            _cvs = document.getElementById('cvs'),
            _cvs_ctx=_cvs.getContext('2d'),
            ultraScan=function(data){
                //93.75 20062.5  22031.25 21(len) 235  21937.5
                _cvs.width = 420;
                _cvs_ctx.beginPath();
                var _h,i=0,_data,
                i1,i2,i3,i0;
                _cvs_ctx.font ='10px Arial';
                _cvs_ctx.fillStyle = '#00a5ff';
                //i1= getInfo(data,214,216,218);
                //i2= getInfo(data,219,221,223);
                //i3= getInfo(data,224,226,228);
                //i4= getInfo(data,229,231,233);
                _cvs_ctx.fillText(i1,i*20,15);
                for(;i<5;i++){
                    _h = 100+ data[214+i];
                    _cvs_ctx.fillRect(i*20,300-_h,10,_h);
                    //_cvs_ctx.fillText(parseInt(data[214+i]),i*20,15);
                }

                _cvs_ctx.fillStyle = '#FF6600';
                //_cvs_ctx.fillText(i2,i*20,15);
                for(;i<10;i++){
                    _h = 100+ data[214+i];
                    _cvs_ctx.fillRect(i*20,300-_h,10,_h);
                    //_cvs_ctx.fillText(parseInt(data[214+i]),i*20,15);
                }
                _cvs_ctx.fillStyle = '#CCFF00';
                //_cvs_ctx.fillText(i3,i*20,15);
                for(;i<15;i++){
                    _h = 100+ data[214+i];
                    _cvs_ctx.fillRect(i*20,300-_h,10,_h);
                    //_cvs_ctx.fillText(parseInt(data[214+i]),i*20,15);
                }
                _cvs_ctx.fillStyle = '#EE0000';
                //_cvs_ctx.fillText(i4,i*20,15);
                for(;i<20;i++){
                    _h = 100+ data[214+i];
                    _cvs_ctx.fillRect(i*20,300-_h,10,_h);
                    //_cvs_ctx.fillText(parseInt(data[214+i]),i*20,15);
                }
                //if(i4 || i1 || i2 || i3){
                //    console.log([i1,i2,i3,i4].join(''));
                //}
                //_cvs_ctx.fillStyle = '#cccccc';
                //_cvs_ctx.fillText(getInfo(data,214+i,216+i,218+i),i*20,15);
                //_h = 100+ data[214+i];
                //_cvs_ctx.fillRect(i*20,300-_h,10,_h);
                //_cvs_ctx.fillText(parseInt(data[214+i]),i*20,15);
                _cvs_ctx.closePath();

            };

        var scan=function(){
            _analyser.getFloatFrequencyData(Data_FF);
            //_analyser.getByteFrequencyDaa(Data_BF);
            ultraScan(Data_FF);
            requestAnimationFrame(scan);
        };
        scan();
        //requestAnimationFrame2(scan,2000);

        document.getElementById('bd').innerHTML=['SampleRate:',ctx.sampleRate,'<br>','FrequencyBinCount:',_analyser.frequencyBinCount].join('');
    };

})();