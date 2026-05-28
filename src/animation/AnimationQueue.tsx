


interface Animation {
  duration: number;
  update: (t:number) => void;
}

class AnimationQueue {
  private queue: Animation[] = [];
  private startTime = 0;

  // Add an animation to the queue
  enqueue(animation: Animation) {
    this.queue.push(animation);
    if (this.queue.length == 1) {
      this.startTime = performance.now()
      this.play()
    }
  }

  private play = () => {
    const time = performance.now();
    const t = Math.min(1,(time - this.startTime) / this.queue[0].duration)

    // Update the animation
    if (this.queue.length !== 0){
      this.queue[0].update(t)
    }

    // If the animation is done, go to the next
    if (t >= 1) {
      this.queue.shift()
      this.startTime = performance.now()
    }

    // If there is still something in the queue, play it
    if (this.queue.length !== 0){
      requestAnimationFrame(this.play)
    }
  }
}

export const animationQueue = new AnimationQueue();