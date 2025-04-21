
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
let currentSong = new Audio();
async function getSongs() {
    const file = "songs.html"; // the HTML file you're reading from

    let response = await fetch(`/${file}`);
    let text = await response.text();

    let div = document.createElement("div");
    div.innerHTML = text;

    let anchors = div.querySelectorAll('a[href$=".mp3"]');
    let songs = [];

    anchors.forEach(anchor => {
        let href = anchor.getAttribute("href");
        if (href.endsWith(".mp3")) {
            songs.push(href); // store full or relative path
        }
    });

    return songs;
}
const playMusic = (songPath) => {
    // let audio = new Audio(songPath);
    currentSong.src = songPath;
    // currentSong.play();
    // play.src = "pause.svg"
    if (!currentSong.pause()) {
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(songPath)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    // audio.play()
};

async function main() {
    let songs = await getSongs();
    console.log("🎵 Songs Found:", songs);
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="" srcset="">
                            <div class="info">
                                <div>${song.replaceAll("20%"," ")}</div>
                                <div>Deepak</div>
                            </div>
                            <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert" src="play.svg" alt="" srcset="">
                            </div>
                        </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
        console.log(e)
    })
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }

        currentSong.addEventListener("timeupdate", () => {
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        })
        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent + "%";
            currentSong.currentTime = ((currentSong.duration) * percent) / 100
        })
        document.querySelector(".hamburger").addEventListener("click", () => {
            document.querySelector(".left").style.left = "0"
            console.log("Hamburger clicked");
        })

        document.querySelector(".close").addEventListener("click", () => {
            document.querySelector(".left").style.left = "-130%"
            console.log("Cross clicked");
        })

        previus.addEventListener("click", () => {
            currentSong.pause()
            console.log("Previous clicked")
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            if ((index - 1) >= 0) {
                playMusic(songs[index - 1])
            }
        })


        next.addEventListener("click", () => {
            currentSong.pause()
            console.log("Next clicked")
    
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            if ((index + 1) < songs.length) {
                playMusic(songs[index + 1])
            }
        })

        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
            console.log("Setting volume to", e.target.value, "/ 100")
            currentSong.volume = parseInt(e.target.value) / 100
            if (currentSong.volume >0){
                document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
            }
        })
    
        // const hamburger = document.querySelector(".hamburger");
        // const closeBtn = document.querySelector(".close");
        // const sidebar = document.querySelector(".left");
        // hamburger.addEventListener("click", () => {
        //     sidebar.style.left = "0";
        // });

        // closeBtn.addEventListener("click", () => {
        //     document.querySelector(".left").style.left = "-120%";
        // });
    
    })




                        // <li>${song.replaceAll("20%"," ")}</li>`;

    // Optional: Play the first song (just for demo)
    // if (songs.length > 0) {
    //     const audio = new Audio(songs[0]);
    //     audio.play();
    // }
}

main();
