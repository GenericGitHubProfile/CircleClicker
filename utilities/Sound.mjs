export class Sound {
    constructor(src = null, loop=false) {
        if(!src) throw new Error("Must have file path to sound");

        this.SOUND = new Audio(src);
        this.SOUND.volume = 0.5;
        this.SOUND.loop = loop;
    }

    play() {
        this.SOUND.play();
    }

    stop() {
        this.SOUND.pause();
    }
}
