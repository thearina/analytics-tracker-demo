interface Tracker {
  track(event: string, ...tags: string[]): void;
}

interface TrackedEvent {
  event: string;
  tags: string[];
  url: string;
  title: string;
  ts: number;
}

class EventTracker implements Tracker {
  private endpoint = "http://localhost:8888/track";
  private events: TrackedEvent[] = [];
  private isProcessing = false;
  private timerId: number | undefined;
  private flushTimeout = 1000;
  private retryRequestTimeout = 1000;
  private immediateThreshold = 3;

  constructor() {
    // Send any pending events when the page is being hidden/closed
    const handleFinalSend = () => this.flushOnUnload();
    window.addEventListener("pagehide", handleFinalSend);

    // If there is a placeholder tracker with queued calls, replay them
    const temporaryTracker = window.tracker;
    if (temporaryTracker && Array.isArray(temporaryTracker.queue)) {
      console.log("queue", temporaryTracker.queue);
      temporaryTracker.queue.forEach((args) => {
        // Defense in case the queue is malformed
        if (Array.isArray(args) && args.length > 0) {
          const [event, ...tags] = args;
          this.track(event, ...tags);
        }
      });
    }
  }

  track(event: string, ...tags: string[]): void {
    const fullEvent: TrackedEvent = {
      event,
      tags,
      url: window.location.href,
      title: document.title,
      ts: Math.floor(Date.now() / 1000),
    };

    this.events.push(fullEvent);
    this.scheduleFlush();
  }

  private resetPendingFlush(): void {
    if (this.timerId !== undefined) {
      window.clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  }

  private scheduleFlush(): void {
    if (this.events.length === 0) return;

    // If at least 3 events are queued and not currently sending, flush immediately
    if (!this.isProcessing && this.events.length >= this.immediateThreshold) {
      this.resetPendingFlush();
      void this.flush();
      return;
    }

    // Trailing batching: always wait up to 1s after the first event arrives before flushing,
    // even if the previous flush was long ago or never happened. This allows batching bursts.
    if (this.timerId === undefined) {
      this.timerId = window.setTimeout(() => {
        this.timerId = undefined;
        void this.flush();
      }, this.flushTimeout);
    }
  }

  private async flush(): Promise<void> {
    if (this.isProcessing || this.events.length === 0) return;

    this.resetPendingFlush();

    this.isProcessing = true;

    const events = this.events.splice(0, this.events.length);

    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: {
          // text/plain keeps it a simple request (no preflight)
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(events),
      });
    } catch (err) {
      // Network failure: wait 1 second, then return events to buffer and reschedule
      window.setTimeout(() => {
        // Put failed events back at the front to preserve ordering
        this.events.unshift(...events);
        this.scheduleFlush();
      }, this.retryRequestTimeout);
    } finally {
      this.isProcessing = false;
    }

    // If more events arrived during the send, schedule the next flush
    if (this.events.length > 0) {
      this.scheduleFlush();
    }
  }

  private flushOnUnload(): void {
    if (this.events.length === 0) return;

    this.resetPendingFlush();

    const events = this.events.splice(0, this.events.length);
    const eventsString = JSON.stringify(events);

    // Prefer sendBeacon; fall back to keepalive fetch if unavailable or returns false
    let beaconQueued: boolean;
    try {
      beaconQueued =
        navigator.sendBeacon?.(this.endpoint, eventsString) ?? false;
    } catch {
      beaconQueued = false;
    }

    if (!beaconQueued) {
      // Fire-and-forget keepalive. We can't await its result here.
      void fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        keepalive: true,
        body: eventsString,
      }).catch(() => {
        // avoiding "Unhandled promise rejection" noise because we're unloading anyway
      });
    }
  }
}

// Replace placeholder with real tracker instance
window.tracker = new EventTracker();
