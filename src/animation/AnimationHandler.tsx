


export interface Animation {
  duration: number;
  update: (t:number) => void;
}

interface AnimationRunner {
  animation: Animation,
  startTime: number,
  id: string,
  t: number,
}

/**
 * 
 * addToQueue: runs things in order
 * 
 * runAnimation: runs on its own, can be ided to a 
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

  playAnimation(animation: Animation, id:string = ''){
    if (animation.duration == 0) return
    if (id !== ''){
      this.playing = this.playing.filter(runner => runner.id !== id);
      console.log('canceled anims')
    }
    this.playing.push({animation,
      startTime: performance.now(),
      id: id.length > 0 ? id : this.nextId.toString(),
      t: 0,
    })
    
    this.nextId = (this.nextId+1) % 1000
    if (this.playing.length == 1){
      requestAnimationFrame(this.play)
    }
  }

  private play = () => {
    const time = performance.now();
    console.log('Playing ' + this.playing.length + ' animations' )

    // Update the animations
    this.playing.forEach(runner => {
      //console.log('Animation ' + runner.id )
      runner.t = Math.min(1,(time - runner.startTime) / runner.animation.duration)
      runner.animation.update(runner.t)
      if (runner.id === this.queueHeadId.toString() && runner.t >= 1){
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