const { GLib } = imports.gi;
const Main = imports.ui.main;

class LocalDateTime {

    constructor() {
        this.clockDisplay = null;
        this.timeoutId = null;
    }

    enable() {
        this.clockDisplay = Main.panel.statusArea.dateMenu._clockDisplay;
        this.startInterval();
    }

    disable() {
        this.stopInterval();
        this.clockDisplay.set_text(this.formatDateTime());
        this.clockDisplay = null;
    }

    systemTimeZone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    formatDateTime(timeZone) {
        return new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: timeZone ?? this.systemTimeZone()
        }).replaceAll(',', ' ');
    }

    updateClock() {
        this.clockDisplay.set_text(this.formatDateTime('Asia/Tehran'));
    }

    startInterval() {
        // Update immediately
        this.updateClock();

        // Set up a timer to update every minute
        // Calculate milliseconds until the next minute
        const now = new Date();
        const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

        // First timeout to sync to the minute
        this.timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, msUntilNextMinute, () => {
            this.updateClock();
            // Now set up regular 60-second intervals
            this.timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60, () => {
                this.updateClock();
                return GLib.SOURCE_CONTINUE;
            });
            return GLib.SOURCE_REMOVE;
        });
    }

    stopInterval() {
        if (!this.timeoutId) return;
        GLib.source_remove(this.timeoutId);
        this.timeoutId = null;
    }
}

function init() {
    return new LocalDateTime();
}
