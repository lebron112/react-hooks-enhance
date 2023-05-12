export default class Timer {
  private _isRecording = false;
  private _startTime = 0;
  private _pastTime = 0;

  /**
   * 构造函数
   * @param {boolean} autoStart 是否自动开始计时，默认自动开始
   */
  constructor(autoStart = true) {
    if (autoStart) {
      this.start();
    }
  }

  /**
   * 开始计时，会清除历史状态
   */
  public start = () => {
    this._startTime = new Date().getTime();
    this._pastTime = 0;
    this._isRecording = true;
  }

  /**
   * 暂停计时，会缓存已过时长
   */
  public pause = () => {
    if (this._isRecording) {
      this._isRecording = false;
      this._pastTime += new Date().getTime() - this._startTime;
    }
  }

  /**
   * 恢复计时，暂停后可以调用此继续计时
   */
  public resume = () => {
    if (!this._isRecording) {
      this._startTime = new Date().getTime();
      this._isRecording = true;
    }
  }

  /**
   * 获取时长，不会停止计时器
   * @returns {number} 总时长
   */
  public getDuration = () => {
    let total = this._pastTime || 0;
    if (this._isRecording) {
      total += new Date().getTime() - this._startTime;
    }
    return total;
  }
}
