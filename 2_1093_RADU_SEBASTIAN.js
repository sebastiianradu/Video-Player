document.addEventListener('DOMContentLoaded', function () {
    let list = document.querySelectorAll('.video-list .vid');
    let mainVideo = document.getElementById('mainVideo');
    let title = document.querySelector('.main-video .title');
    let currentIndex = 0;
    const effectSelect = document.getElementById('effectSelect');
    const canvas = document.getElementById('videoCanvas');
    const ctx = canvas.getContext('2d');
    const progressBar = document.getElementById('progressBar');
    const volumeControl = document.getElementById('volumeControl');

 
    // Cerinta 1: posibilitate navigare prin playlist; trecere automată la filmul următor

    // functia schimba video-ul principal

    function changeVideo(index) {
        list.forEach(vid => vid.classList.remove('active'));
        list[index].classList.add('active');
        let src = list[index].children[0].getAttribute('src');
        mainVideo.src = src;
        let text = list[index].children[1].innerHTML;
        title.innerHTML = text;
        currentIndex = index;

        mainVideo.setAttribute('data-id', list[index].getAttribute('data-id'));

        applyEffect(); // se aplica efectul si la schimbarea video-ului
    }


    function moveVideo(fromIndex, toIndex) {
        const listArray = Array.from(list);
    
        if (toIndex >= 0 && toIndex < listArray.length) {
            const removedVideo = listArray[fromIndex];
            listArray.splice(fromIndex, 1);
            listArray.splice(toIndex, 0, removedVideo);
    
            document.querySelector('.video-list').innerHTML = '';
            listArray.forEach((vid, index) => {
                document.querySelector('.video-list').appendChild(vid);
                updateButtons(vid, index);
            });
    
            currentIndex = toIndex;
    
            list = document.querySelectorAll('.video-list .vid');
            list.forEach((vid, index) => {
                vid.onclick = () => {
                    changeVideo(index);
                };
            });
        }
    }



// Cerinta 2: adăugarea de noi filme prin drag and drop sau prin intermediul unui control de tip input 


    document.getElementById('fileInput').addEventListener('change', handleFileSelect);

    function handleFileSelect(event) {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            const videoURL = URL.createObjectURL(file);

            const newVideo = document.createElement('video');
            newVideo.src = videoURL;
            newVideo.muted = true;
            newVideo.style.width = '210px';
            newVideo.style.borderRadius = '5px';

            const newTitle = document.createElement('h3');
            newTitle.className = 'title';
            newTitle.textContent = `Titlu ${list.length + 1}: ${file.name}`;

            const newVid = document.createElement('div');
            newVid.className = 'vid';
            newVid.appendChild(newVideo);
            newVid.appendChild(newTitle);

            newVid.onclick = () => {
                if (list.length > 0) {
                    changeVideo(list.length - 1);
                }
            };

            document.querySelector('.video-list').appendChild(newVid);
            list = document.querySelectorAll('.video-list .vid');
            updateButtons(newVid, list.length - 1);
        }
    }


    // Cerinta 3: modificare ordine filme în playlist; ștergere filme din playlist 

    // funtie pt stergerea unui video din lista
    function deleteVideo(index) {
        if (list.length > 0) {
            list[index].remove();
            list.splice(index, 1);

            // currentIndex e actualizat pt a preveni erori
            if (currentIndex >= list.length) {
                currentIndex = list.length - 1;
            }

            document.querySelector('.video-list').innerHTML = '';
            list.forEach((vid, index) => {
                document.querySelector('.video-list').appendChild(vid);
                updateButtons(vid, index);
            });

            changeVideo(currentIndex);
        }
    }

    // modificare ordine in playlist
    
    function updateButtons(video, index) {
        // sterge butoanele existente
        video.querySelectorAll('button').forEach(button => button.remove());

        const moveUpButton = document.createElement('button');
        moveUpButton.textContent = 'Sus';
        moveUpButton.onclick = (event) => {
            event.stopPropagation();
            moveVideo(index, index - 1);
        };

        const moveDownButton = document.createElement('button');
        moveDownButton.textContent = 'Jos';
        moveDownButton.onclick = (event) => {
            event.stopPropagation();
            moveVideo(index, index + 1);
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Sterge';
        deleteButton.onclick = (event) => {
            event.stopPropagation();
            deleteVideo(index);
        };

        video.appendChild(moveUpButton);
        video.appendChild(moveDownButton);
        video.appendChild(deleteButton);
    }



    // Cerinta 4: aplicare de efecte video selectabile de către utilizator cu ajutorul unui element de tip canvas 
    // (notă: efectele vor fi diferite de cele implementate pe parcursul seminarelor; efectele nu vor fi implementate cu ajutorul CSS) 


    // Am adaugat ca efecte sepia si grayscale
    function applyEffect() {
        const selectedEffect = effectSelect.value;

        if (selectedEffect === 'grayscale') {
            mainVideo.style.filter = 'grayscale(100%)';
        } else if (selectedEffect === 'sepia') {
            mainVideo.style.filter = 'sepia(100%)';
        } else {
            mainVideo.style.filter = 'none';
        }
    }


    function drawFrame() {
        if (mainVideo.paused || mainVideo.ended) {
            return;
        }
    
        const width = mainVideo.videoWidth;
        const height = mainVideo.videoHeight;
    
        canvas.width = width;
        canvas.height = height;
    
        ctx.drawImage(mainVideo, 0, 0, width, height);
    
        applyEffect();
    
        requestAnimationFrame(drawFrame);
    }
    
    drawFrame();

    // Cerinta 5:
    // desenare video și controale semitransparente (previous, play / pause, next, progress bar și volum) 
    // pe același element canvas (suprapuse peste fluxul video) 
    // și determinarea operației pe baza poziției cursorului în cadrul canvasului 


    //desenarea controalelor pentru functionalitatile prev, play/pause, next, progress bar si volum
    function drawControls() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //butonul play/pause
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(10, canvas.height - 14, 10, 10);
        ctx.fillStyle = 'black';
        ctx.fillText('⏯', 8, canvas.height - 5);

        //butonul previous
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(25, canvas.height - 14, 10, 10);
        ctx.fillStyle = 'black';
        ctx.fillText('⏮', 23, canvas.height - 5);

        //butonul next
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(40, canvas.height - 14, 10, 10);
        ctx.fillStyle = 'black';
        ctx.fillText('⏭', 38, canvas.height - 5);

        //progress bar negru acoperit de un alt progress bar rosu care arata timpul curent din video

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, canvas.height - 3, 507, 3);
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.fillRect(0, canvas.height - 3, canvas.width * mainVideo.currentTime / mainVideo.duration , 3);

        //volumul care este acoperit de un alt dreptunghi colorat albastru care arata nivelul volumului
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(canvas.width - 100, canvas.height - 13, 100, 9);
        ctx.fillStyle = 'rgba(63, 141, 254, 0.8)';
        ctx.fillRect(canvas.width - 100, canvas.height - 13, volumeControl.value , 9);
    }

    drawControls();




    //urmeaza functiile pentru butoanele desenate pe canvas

    function playPauseVideo() {
        if (mainVideo.paused) {
            mainVideo.play();
        } else {
            mainVideo.pause();
        }
    }

    function prevVideo() {
        if (currentIndex > 0) {
            changeVideo(currentIndex - 1);
        }
    }

    function nextVideo() {
        if (currentIndex < list.length - 1) {
            changeVideo(currentIndex + 1);
        }
    }

    function updateVolume() {
        mainVideo.volume = volumeControl.value / 100;
        //(cerinta 7 stocare setari, am stocat setarile pentru volum aici)
        localStorage.setItem('volum', volumeControl.value);
        drawControls();
    }

    function setProgressBar(progressPercentage) {
        const progress = progressPercentage / 100;
        mainVideo.currentTime = progress * mainVideo.duration;
        progressBar.value = progressPercentage;
        drawControls();
    }


    //rularea continua a progress bar-ului in timp ce video-ul deruleaza
    mainVideo.addEventListener('play', function () {

        progressBar.value = (mainVideo.currentTime / mainVideo.duration) * 100;

        function updateProgressBar() {
            const progress = (mainVideo.currentTime / mainVideo.duration) * 100;
            progressBar.value = progress;
            drawControls();

            if (!mainVideo.paused && !mainVideo.ended) {
                requestAnimationFrame(updateProgressBar);
            }
        }

        updateProgressBar();
    });


    //verificarea pozitiei mouse-ului astfel incat sa fie suprapus cursorul peste butoanele desenate mai sus
    canvas.addEventListener('click', function (event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = Math.floor(event.clientX - rect.left);
        const mouseY = Math.floor(event.clientY - rect.top);

        if (mouseX >= 30 && mouseX <= 56 && mouseY >= 452  && mouseY <= 480) {
            playPauseVideo();
        } else if (mouseX >= 74 && mouseX <= 100 && mouseY >= 452 && mouseY <= 481) {
            prevVideo();
        } else if (mouseX >= 118 && mouseX <= 144 && mouseY >= 452 && mouseY <= 481) {
            nextVideo();
        }

        //verificarea pozitiei mouse-ului peste bara de volum
    const volumeControlArea = {
        left: 586,
        top: 452,
        right: 880,
        bottom: 481
    };

    if (
        mouseX >= volumeControlArea.left &&
        mouseX <= volumeControlArea.right &&
        mouseY >= volumeControlArea.top &&
        mouseY <= volumeControlArea.bottom
    ) {
        // calculeaza procentul de volum bazat pe pozitia clicului in zona controlului de volum
        const volumePercentage = ((mouseX - volumeControlArea.left) / (volumeControlArea.right - volumeControlArea.left)) * 100;
        volumeControl.value = volumePercentage;
        updateVolume();
    }


        //verificarea pozitiei mouse-ului peste preogress bar
        const progressBarArea = {
            left: 0,
            top: 486,
            right: 881,
            bottom: 495
        };
    
        if (
            mouseX >= progressBarArea.left &&
            mouseX <= progressBarArea.right &&
            mouseY >= progressBarArea.top &&
            mouseY <= progressBarArea.bottom
        ) {
            const progressPercentage = ((mouseX - progressBarArea.left) / (progressBarArea.right - progressBarArea.left)) * 100;
    
            setProgressBar(progressPercentage);
        }


});


    
    list.forEach((video, index) => {
        video.onclick = () => {
            changeVideo(index);
        };

        updateButtons(video, index);
    });

    //autoplay-ul, functionalitatea ca atunci cand un video se termina, automat sa inceapa urmatorul
    mainVideo.addEventListener('ended', () => {
        if (currentIndex < list.length - 1) {
            changeVideo(currentIndex + 1);
        }
    });

// Cerinta 6: afisare subtitrari (stocate sub forma de fisiere JSON in cadrul aplicatiei)           

    let subtitleArray = [];

    mainVideo.addEventListener('timeupdate', function() {
    var currentTime = Math.floor(mainVideo.currentTime);

    fetch('subtitles.json')
        .then(response => response.json())
        .then(subtitles => {
            subtitleArray = subtitles;

            const currentSubtitle = findSubtitle(currentTime);

            const subtitleContainer = document.getElementById('subtitleContainer');
            subtitleContainer.innerText = currentSubtitle ? currentSubtitle.text : "";
        });
});

// functie pt a gasi subtitrarea potrivita in functie de timpul curent
function findSubtitle(currentTime) {
    const dataId = mainVideo.getAttribute('data-id');
    return subtitleArray.find(subtitle => currentTime >= subtitle.start && currentTime <= subtitle.end && dataId == subtitle.id);
}


// Cerinta 7: stocare setări (ex: nivel volum, poziție curentă în cadrul playlist-ului) cu ajutorul Web Storage API  


const storedVolume = localStorage.getItem('volum');
const storedEffect = localStorage.getItem('efectSelectat');

// am setat volumul si pozitia in playlist cu valorile salvate 
volumeControl.value = storedVolume || 100;
effectSelect.value = storedEffect;

// am actualizat efectul video astfel incat mereu cand este schimbat sa se actualizeze si vode-ul
//si am salvat in localStorage efectul
effectSelect.addEventListener('change', function() {
    applyEffect();
    localStorage.setItem('efectSelectat', effectSelect.value);
});

});