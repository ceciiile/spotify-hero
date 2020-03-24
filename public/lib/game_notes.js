class GameNotes {
  constructor(noteInterval, musicDelay, key) {
    this.noteInterval = noteInterval;
    this.musicDelay = musicDelay;
    this.key = key;

    this.scoreEl = document.getElementsByClassName('score')[0];
    this.maxStreakEl = document.getElementsByClassName('max-streak')[0];
    this.streakEl = document.getElementsByClassName('streak')[0];
    this.multiplierEl = document.getElementsByClassName('multiplier')[0];
    this.gameProgressEl = document.getElementsByClassName('game-progress')[0];
    this.rockInputEl = document.getElementsByClassName('rock-input')[0];

    this.score = 0;
    this.maxStreak = 0;
    this.streak = 0;
    this.multiplier = 1;
    this.hits = 0;
    this.misses = 0;
    this.rockInput = 0;
  }

  setNoteCheck(position, time, duration, notesCount, idx) {
    let timeDelay = 1000 + this.musicDelay + time;

    setTimeout(
      () => this.checkNote(position, duration, notesCount, idx),
      timeDelay
    );
  }

  checkNote(position, duration, notesCount, idx) {
    let startTime = Date.now();
    let endTime = startTime + duration;
    let interval = 20; //each 20 ms we add points if user press correct key during long note

    let check = setInterval(() =>{
      startTime += interval;

      if(startTime > endTime){
        clearInterval(check);
      }

      this.updateScore(position)
    },interval);

    if(idx == notesCount){
      setTimeout(()=>{
        var scoreTosave = document.getElementsByClassName('score')[0].innerHTML
        scoreTosave = scoreTosave.replace( /^\D+/g, '');
        document.getElementsByClassName('result-score')[0].innerHTML = "Your score : " + scoreTosave;
        document.getElementsByClassName('end-game')[0].className="end-game";
      }, 3000)
    }
  }

  updateScore(position){
    let res = false;
    if (this.key.isDown(this.key.pos[position])) {
      res = true
      if (this.streak === 30) {
        this.multiplier = 4;
      } else if (this.streak === 20) {
        this.multiplier = 3;
      } else if (this.streak === 10) {
        this.multiplier = 2;
      }
      this.score += 100 * Number(this.multiplier);
      this.hits += 1;
      this.streak += 1;
      if (this.rockInput < 20) {
        this.rockInput += 1;
      }
    } else {
      this.streak = 0;
      this.misses += 1;
      this.multiplier = 1;
      if (this.rockInput > -20 ) {
        this.rockInput -= 1;
      }
      if (this.rockInput < -10) {
        this.gameProgressEl.className = 'game-progress red';
        setTimeout(() => {this.gameProgressEl.className = 'game-progress';}, 75);
      }
    }
    if (this.rockInput > 19) {
      this.gameProgressEl.className = 'game-progress green';
    } else if (this.rockInput > 10) {
      this.gameProgressEl.className = 'game-progress yellow';
    } else if (this.rockInput > -10 && this.rockInput < 10) {
      this.gameProgressEl.className = 'game-progress';
    }

    if (this.streak > this.maxStreak) {
      this.maxStreak = this.streak;
    }

    this.scoreEl.innerHTML = `Score: ${this.score}`;
    this.maxStreakEl.innerHTML = `Max Streak: ${this.maxStreak}`;
    this.streakEl.innerHTML = `Streak: ${this.streak}`;
    this.multiplierEl.innerHTML = `Multiplier: ${this.multiplier}X`;
    this.rockInputEl.value = this.rockInput;//('value', `${this.rockInput}`);
  }
}

export default GameNotes;
