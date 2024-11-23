// https://stackoverflow.com/a/3969760
/**
 * Timer class to handle start, pause, resume, and stop functionality for a timer.
 */
export default class Timer {
  private startedAt: number;
  private callback: () => void;
  private delay: number;
  private timer: ReturnType<typeof setTimeout>;

  /**
   * Creates an instance of Timer.
   * @param callback - The callback function to be executed after the delay.
   * @param delay - The delay in milliseconds.
   */
  constructor(callback: () => void, delay: number) {
    this.startedAt = Date.now();
    this.callback = callback;
    this.delay = delay;
    this.timer = setTimeout(this.callback, this.delay);
  }

  /**
   * Pauses the timer and adjusts the delay.
   */
  pause() {
    this.stop();
    this.delay -= Date.now() - this.startedAt;
  }

  /**
   * Resumes the timer with the adjusted delay.
   */
  resume() {
    this.stop();
    this.startedAt = Date.now();
    this.timer = setTimeout(this.callback, this.delay);
  }

  /**
   * Stops the timer.
   */
  stop() {
    clearTimeout(this.timer);
  }
}
