const seekInterval = 10 // Seconds to seek forward or backward
const progress = document.getElementById('progress')
let progressTimer = null

let rock = {
    pre: new Howl({ src: 'https://static.wixstatic.com/mp3/cd504d_fc3654574bf64132ba0b88f82af5680e.mp3', html5: true }),
    mix: new Howl({ src: 'https://static.wixstatic.com/mp3/cd504d_60027ff8c98d4087a5ad424710d96818.mp3', html5: true }),
    master: new Howl({ src: 'https://static.wixstatic.com/mp3/cd504d_b9f628655f274df5afdff986bee28e8b.mp3', html5: true })
}

let hard_rock = {
    pre: new Howl({ src: 'https://static.wixstatic.com/mp3/cd504d_197f58b059a445c58789055eb02e5ba2.wav', html5: true }),
    mix: new Howl({ src: 'https://static.wixstatic.com/mp3/cd504d_6e3cea775a1e47299c29adcb1f6de07f.wav', html5: true }),
    master: new Howl({ src: 'https://static.wixstatic.com/mp3/cd504d_4af74efca5ec4bab88b05c5b89194736.wav', html5: true })
}

let singer_songwriter = {
    pre: new Howl({ src: 'https://static.wixstatic.com/mp3/cd504d_197f58b059a445c58789055eb02e5ba2.wav', html5: true }),
    mix: new Howl({ src: 'https://static.wixstatic.com/mp3/cd504d_6e3cea775a1e47299c29adcb1f6de07f.wav', html5: true }),
    master: new Howl({ src: 'https://static.wixstatic.com/mp3/cd504d_4af74efca5ec4bab88b05c5b89194736.wav', html5: true })
}

let soft_rock = {
    pre: new Howl({ src: 'https://static.wixstatic.com/mp3/cd504d_25ea0210cfeb4a25b15279db2bc18762.mp3', html5: true }),
    mix: new Howl({ src: 'https://static.wixstatic.com/mp3/cd504d_524b3fd2cdb74eb68a02b9eda2a43dac.mp3', html5: true }),
    master: new Howl({ src: 'https://static.wixstatic.com/mp3/cd504d_fefa202c60d548c08d54ea41d5cdef6a.mp3', html5: true })
}

let current = {
    img: 'https://static.wixstatic.com/media/cd504d_2fa458ffd1dc4a2c840f82fdb6d706c1~mv2.jpg',
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
            current.img = 'https://static.wixstatic.com/media/cd504d_2fa458ffd1dc4a2c840f82fdb6d706c1~mv2.jpg'
            current.artist = 'Voice of Nature'
            current.title = 'Rosas para Maria'
            current.genre = rock
            current.sound = rock.pre
            break
        case 'hard_rock':
            current.img = 'https://static.wixstatic.com/media/cd504d_2b2a6b1e44744cccb335d0852d98b80e~mv2.jpg'
            current.artist = 'Mary Spender'
            current.title = 'Someone Better'
            current.genre = hard_rock
            current.sound = hard_rock.pre
            break
        case 'singer_songwriter':
            current.img = 'https://static.wixstatic.com/media/cd504d_2b2a6b1e44744cccb335d0852d98b80e~mv2.jpg'
            current.artist = 'Mary Spender'
            current.title = 'Someone Better'
            current.genre = singer_songwriter
            current.sound = singer_songwriter.pre
            break
        case 'soft_rock':
            current.img = 'https://static.wixstatic.com/media/cd504d_0c54f2b1ebed42239e31484793036dcd~mv2.jpg'
            current.artist = 'Steve Maggiora'
            current.title = 'Whiskey'
            current.genre = soft_rock
            current.sound = soft_rock.pre
            break
    }
    
    img.src = current.img
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