;(function() {
	"use strict";

	function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}



	var searchForm = document.querySelector('.ba-search-form'),
		queryInput = searchForm.query,
		loader = document.querySelector('.ba-loader');


	var request = new XMLHttpRequest(),
		url,
		data; 

	var tuneTmpl = document.getElementById('tune-tmpl').innerHTML,
		tuneList = document.querySelector('.ba-tunes-list'),
		tunesListHTML = '';	

		

	searchForm.addEventListener('submit', getTunes);

	function getTunes(event){
		event.preventDefault();
		// Show loader
		loader.classList.add('active');
		tuneList.innerHTML = '';

		url = 'https://itunes.apple.com/search?term=' + queryInput.value + '&limit=20'

		request.open('GET', url);

		request.send();
		
	}


	request.onreadystatechange = function(){
		var serverResponse = this;
		if (serverResponse.readyState !=4 || serverResponse.status != 200) return;

		data = JSON.parse(serverResponse.response);
		tunesListHTML = '';

		data.results.forEach(function(tune){
			
			// Make tune for template

			tunesListHTML += tuneTmpl
			.replace(/{{artworkUrl100}}/ig, tune.artworkUrl100)
			.replace(/100x100/ig, '400x400')
			.replace(/{{artistName}}/ig, tune.artistName)
			.replace(/{{trackTime}}/ig, msToTime(tune.trackTimeMillis))
			.replace(/{{trackName}}/ig, tune.trackName)
			.replace(/{{collectionName}}/ig, tune.collectionName)
			.replace(/{{primaryGenreName}}/ig, tune.primaryGenreName)
			.replace(/{{collectionPrice}}/ig, tune.collectionPrice)
			.replace(/{{collectionViewUrl}}/ig, tune.collectionViewUrl)
			.replace(/{{previewUrl}}/ig, tune.previewUrl)
			.replace(/{{trackId}}/ig, tune.trackId)

		});


		setTimeout(function(){
		loader.classList.remove('active');

		// Make tune html into tunes-list element
		tuneList.innerHTML = tunesListHTML;
		},1000);
			
		}
		

		// Play button

		tuneList.addEventListener('click', playAudio);
		function playAudio(event) {
        
        var audioBtn = event.target,
            audioId = audioBtn.dataset.audio;

        // If we clicken not on play btn do nothing
        if(audioId == undefined) return;

        var audioEl = document.getElementById(audioId);

        var allAudios = document.querySelectorAll('audio'),
            allAudioBtns = document.querySelectorAll('.ba-play-btn.pulse');

        allAudios.forEach(function (audio) {
            if(audio != audioEl){
                audio.pause();            
            }
        });
        allAudioBtns.forEach(function (btn) {
            if(btn != audioBtn){
                btn.classList.remove('pulse');                
            }
        });

        if(audioEl.paused){
            audioEl.play();            
            audioBtn.classList.add('pulse');
        } else {
            audioEl.pause();            
            audioBtn.classList.remove('pulse');            
        }    
        
    }
	
	
})();

