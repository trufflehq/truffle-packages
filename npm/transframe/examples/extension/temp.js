const getTimestampOfAction = function (action) {
  if (action.addChatItemAction) {
    action = action.addChatItemAction.item;
    var b = Object.keys(action)[0];
    action = action[b];
    if (action.timestampUsec) return parseInt(action.timestampUsec, 10);
  }
  return -1;
};

const findFirstChatMessageTimestamp = function (thisQueue) {
  const actionQueue = [...thisQueue.actionQueue_];
  for (const item of actionQueue) {
    const timestamp = getTimestampOfAction(b.value);
    if (timestamp !== -1) return timestamp;
  }
  return -1;
};

const enqueueActionGroup = function (actionGroup) {
  const now = Date.now();
  const timeSinceLastPoll = now - this.lastPollTimeMs_;
  this.lastPollTimeMs_ = now;
  this.pollIntervalsMs_.add(timeSinceLastPoll);
  this.actionQueue_.push.apply(this.actionQueue_, ia(actionGroup));

  let firstItemTimestamp = findFirstChatMessageTimestamp(this);

  let lastItemTimestamp = -1;
  for (let i = this.actionQueue_.length - 1; 0 <= i; i--) {
    const actionTimestamp = getTimestampOfAction(this.actionQueue_[i]);
    if (actionTimestamp !== -1) {
      lastItemTimestamp = actionTimestamp;
      break;
    }
  }
  const timestampScale = 1;
  if (
    -1 != firstItemTimestamp &&
    -1 != lastItemTimestamp &&
    lastItemTimestamp > firstItemTimestamp
  ) {
    const pollInterval = this.smallestPollInterval;
    timestampScale = (lastItemTimestamp - firstItemTimestamp) / pollInterval;
  }
  this.timestampScale_ = timestampScale;
  this.currentTimestampUs_ = findFirstChatMessageTimestamp(this);
  this.animationFrameRequestId_ ||
    ((this.lastUpdateTimeMs_ = performance.now()),
    Txb(this, this.lastUpdateTimeMs_));
};

const emitSmoothedMessages_ = function () {
  this.nextUpdateId_ = null;
  if (this.messageQueue_.length) {
    const timeUntilNextUpdate = 10000; // 10 second
    if (this.estimatedUpdateInterval_) {
      timeUntilNextUpdate =
        this.estimatedUpdateInterval_ - Date.now() + this.lastUpdateTime_;
    }

    // batch size between 1 and inf
    const batchSize =
      this.messageQueue_.length < timeUntilNextUpdate / 80
        ? 1
        : Math.ceil(this.messageQueue_.length / (timeUntilNextUpdate / 80));

    const batch = this.messageQueue_.splice(0, batchSize);

    this.callback && this.callback(batch);

    // If there are still messages
    if (this.messageQueue_.length) {
      let timeUntilNextMessages;
      if (batchSize === 1) {
        timeUntilNextMessages = timeUntilNextUpdate / this.messageQueue_.length;
        timeUntilNextMessages *= Math.random() + 0.5;
        // Clamp between 80 and 1000
        timeUntilNextMessages = Math.min(1000, timeUntilNextMessages);
        timeUntilNextMessages = Math.max(80, timeUntilNextMessages);
      } else {
        timeUntilNextMessages = 80;
      }
      this.nextUpdateId_ = window.setTimeout(
        emitSmoothedMessages_.bind(this),
        timeUntilNextMessages
      );
    }
  }
};
