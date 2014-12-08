(function(){
    //ff
    var AudioContext = webkitAudioContext,
    GetUserMedia = webkitGetUserMedia,
    VoiceRecognition = webkitSpeechRecognition,
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback,el){
        return setTimeout(callback,1000/60);
    };


    /*
    * @namespace   SonicPainter
    * @Author:     yulianghuang
    * @CreateDate  2014/12/8
    * @Desciption  paint sound
    */
    (function(){
        var painters={
            line:function(canvas,data){

            },
            rectangle:function(canvas,data){

            },
            round:function(canvas,data){

            }
        };

        var SonicPainter = function(){

        };
        SonicPainter.prototype=function(){
            attach:function(canvas,input){

            },
            start:function(){

            },
            stop:function(){

            },
            draw:function(){

            },
            initCanvas:function(){

            }
        };

    })();
})();