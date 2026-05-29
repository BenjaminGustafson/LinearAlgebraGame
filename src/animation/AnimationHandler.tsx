


export interface Animation {
  duration: number;
  update: (t:number) => void;
}

interface AnimationRunner {
  animation: Animation,
  startTime: number,
  id: number,
  t: number;
}

/**
 * 
 * addToQueue: runs things in order
 * 
 * runAnimation: runs on its own
 */
class AnimationHandler {
  private queue: Animation[] = [];
  private playing: AnimationRunner[] = [];
  private nextId = 0;
  private queueHeadId = -1;

  // Add an animation to the queue
  queueAnimation(animation: Animation) {
    this.queue.push(animation);
    if (this.queue.length == 1) {
      this.queueHeadId = this.nextId
      this.playAnimation(animation)
    }
  }

  playAnimation(animation: Animation){
    this.playing.push({animation,
      startTime: performance.now(),
      id: this.nextId,
      t: 0,
    })
    this.nextId = (this.nextId+1) % 1000
    if (this.playing.length == 1){
      requestAnimationFrame(this.play)
    }
  }

  private play = () => {
    console.log('Playing ' + this.playing.length + ' animations')
    const time = performance.now();
    
    // Update the animations
    this.playing.forEach(runner => {
      runner.t = Math.min(1,(time - runner.startTime) / runner.animation.duration)
      runner.animation.update(runner.t)
      if (runner.id == this.queueHeadId && runner.t >= 1){
        this.queue.shift()
        if (this.queue.length !== 0){
          this.queueHeadId = this.nextId
          this.playAnimation(this.queue[0])
        }
      }
    })

    // Filter out finished animations
    this.playing = this.playing.filter(runner => runner.t < 1);

    // If there is still an animation, play it
    if (this.playing.length !== 0){
      requestAnimationFrame(this.play)
    }
  }
}

export const animationHandler = new AnimationHandler();