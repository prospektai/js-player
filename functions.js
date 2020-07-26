const seekInterval = 10 // Seconds to seek forward or backward
const progress = document.getElementById('progress')
let progressTimer = null

let rock = {
    pre: new Howl({ src: 'tracks/VoiceOfNature_Rosas_para_Maria/pre.mp3', html5: true }),
    mix: new Howl({ src: 'tracks/VoiceOfNature_Rosas_para_Maria/mix.mp3', html5: true }),
    master: new Howl({ src: 'tracks/VoiceOfNature_Rosas_para_Maria/master.mp3', html5: true })
}

let hard_rock = {
    pre: new Howl({ src: 'tracks/Corey_Reflections/pre.wav', html5: true }),
    mix: new Howl({ src: 'tracks/Corey_Reflections/mix.wav', html5: true }),
    master: new Howl({ src: 'tracks/Corey_Reflections/master.wav', html5: true })
}

let singer_songwriter = {
    pre: new Howl({ src: 'tracks/MarySpender_Someone_Better/pre.wav', html5: true }),
    mix: new Howl({ src: 'tracks/MarySpender_Someone_Better/mix.wav', html5: true }),
    master: new Howl({ src: 'tracks/MarySpender_Someone_Better/master.wav', html5: true })
}

let soft_rock = {
    pre: new Howl({ src: 'tracks/Steve_Maggiora_Whiskey/pre.mp3', html5: true }),
    mix: new Howl({ src: 'tracks/Steve_Maggiora_Whiskey/mix.mp3', html5: true }),
    master: new Howl({ src: 'tracks/Steve_Maggiora_Whiskey/master.mp3', html5: true })
}

let current = {
    path: 'tracks/VoiceOfNature_Rosas_para_Maria/',
    artist: 'Voice of Nature',
    title: 'Rosas para Maria',
    mix: 'pre',
    genre: rock,
    sound: rock.pre
}

function switchGenre(genre){
    let img = document.getElementById('track-img')
    let track_artist = document.getElementById('track-artist')
    let track_title = document.getElementById('track-title')

    stopAudio() // Set UI element and stop audio

    switch(genre){
        case 'rock':
            current.path = 'tracks/VoiceOfNature_Rosas_para_Maria/'
            current.artist = 'Voice of Nature'
            current.title = 'Rosas para Maria'
            current.genre = rock
            current.sound = rock.pre
            break
        case 'hard_rock':
            current.path = 'tracks/Corey_Reflections/'
            current.artist = 'Corey'
            current.title = 'Reflections'
            current.genre = hard_rock
            current.sound = hard_rock.pre
            break
        case 'singer_songwriter':
            current.path = 'tracks/MarySpender_Someone_Better/'
            current.artist = 'Mary Spender'
            current.title = 'Someone Better'
            current.genre = singer_songwriter
            current.sound = singer_songwriter.pre
            break
        case 'soft_rock':
            current.path = 'tracks/Steve_Maggiora_Whiskey/'
            current.artist = 'Steve Maggiora'
            current.title = 'Whiskey'
            current.genre = soft_rock
            current.sound = soft_rock.pre
            break
    }
    
    img.src = current.path + 'cover.jpg'
    track_artist.innerText = current.artist
    track_title.innerText = current.title

    resetMix() // Updates UI to reflect initial mix selection
}

function switchMix(mix){
    current.mix = mix

    let seamlessSwitch = false
    let currentSeek = current.sound.seek()
    
    if(current.sound.playing()){
        current.sound.stop()
        seamlessSwitch = true
    }

    switch(mix){
        case 'pre':
            current.sound = current.genre.pre
            break
        case 'mix':
            current.sound = current.genre.mix
            break
        case 'master':
            current.sound = current.genre.master
            break
    }

    if(seamlessSwitch){
        current.sound.seek(currentSeek)
        current.sound.play()
    }
}

function control(control){
    switch(control){
        case 'play':
            if(!current.sound.playing()){
                current.sound.play()
                progressTimer = setInterval(() => {
                    updateTime()
                }, 500)
            }
            break
        case 'pause':
            current.sound.pause()
            clearInterval(progressTimer)
            break
        case 'fr':
            seekAudio(false)
            break
        case 'ff':
            seekAudio(true)
            break
    }
}

function stopAudio(){
    // Stop all sounds before switching
    Howler.stop()
    clearTime()
    clearInterval(progressTimer)
    let playButton = document.getElementById('play-btn')
    let pauseButton = document.getElementById('pause-btn')

    playButton.removeAttribute('checked')
    playButton.parentElement.classList.remove('active')

    pauseButton.setAttribute('checked', '')
    pauseButton.parentElement.classList.add('active')
}

function seekAudio(forward){
    let currentSeek = current.sound.seek()
    let currentDuration = current.sound.duration()

    if(forward){
        if(currentSeek + seekInterval < currentDuration){
            current.sound.seek(currentSeek + seekInterval)
            console.log('seek forward')
        }
    }else if(!forward){
        if(currentSeek - seekInterval > 0){
            current.sound.seek(currentSeek - seekInterval)
        }
    }

    updateTime()
}

function updateTime(){
    let currentSeek = current.sound.seek()
    let currentDuration = current.sound.duration()

    progress.innerText = `${new Date(Math.round(currentSeek) * 1000).toISOString().substr(11, 8)} / ${new Date(Math.round(currentDuration) * 1000).toISOString().substr(11, 8)}`
}

function resetMix(){
    let preBtn = document.getElementById('premix-btn')
    let mixBtn = document.getElementById('mixed-btn')
    let masteredBtn = document.getElementById('mastered-btn')

    mixBtn.removeAttribute('checked')
    mixBtn.parentElement.classList.remove('active')

    masteredBtn.removeAttribute('checked')
    masteredBtn.parentElement.classList.remove('active')

    preBtn.setAttribute('checked', '')
    preBtn.parentElement.classList.add('active')
}

function clearTime(){
    progress.innerText = '00:00:00 / 00:00:00'
}