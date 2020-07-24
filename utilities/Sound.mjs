export class Sound {
    constructor(src = null, doc = null, loop=false) {
        if (!src || !doc) throw Error("Must include a path to the sound file");

        this.sound = doc.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        if(typeof loop == "boolean") {
            this.sound.setAttribute("loop", loop);
        } else {
            this.sound.setAttribute("loop", "false");
        }
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    play() {
        this.sound.play();
    }

    stop() {
        this.sound.pause();
    }
}
