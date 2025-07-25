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
        this.clockDisplay = null;
    }

    formatDateTime(timeZone) {
        return new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone,
        }).replaceAll(',', ' ');
    }

    targetTimeZone() {
        return 'Asia/Tehran';
    }

    systemTimeZone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    updateClock(timeZone) {
        this.clockDisplay.set_text(
            this.formatDateTime(timeZone ?? this.targetTimeZone())
        );
    }

    startInterval() {
        this.updateClock();
        this.timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
            this.updateClock();
            return GLib.SOURCE_CONTINUE;
        });
    }

    stopInterval() {
        GLib.source_remove(this.timeoutId);
        this.timeoutId = null;
        this.updateClock(this.systemTimeZone());
    }
}

function init() {
    return new LocalDateTime();
}
