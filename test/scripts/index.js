var audio;

$(function () {
    setup()
    var request = new XMLHttpRequest();
    url = "https://cors-anywhere.herokuapp.com/https://lli.ililllliliillilliliil.li/mp3/Nait_Masuku_Paul_Leary_Holly_Harding_Matthew_Manche_Big_Official_Audio_.mp3" ///static/music/darkside.mp3
    request.open("GET", url, true);
    request.responseType = "blob";
    request.onload = function () {
        if (this.status == 200) {
            audio = new Audio(URL.createObjectURL(this.response));
            audio.load();
            //   audio.play();
            audio.addEventListener('MozAudioAvailable',  function(data){
                console.log(data)
            }, false);
            audio.addEventListener('loadedmetadata',  function(data){
                console.log(data)
            }, false);
        }
    }
   
    request.send();


})

$(document).on("click", ".play", function (){
    if(!audio){ console.error("failed"); return}
    audio.play()
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;

    setInterval(function (){
        array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array); 
        console.log(array);
    }, 1000)
})
$(document).on("click", ".pause", function (){
    audio.pause()
})
