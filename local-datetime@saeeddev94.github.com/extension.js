const Main = imports.ui.main;

class LocalDateTime {

    constructor() {
        this.clock = null;
        this.clockDisplay = null;
        this.signalId = null;
    }

    enable() {
        this.clock = Main.panel.statusArea.dateMenu._clock;
        this.clockDisplay = Main.panel.statusArea.dateMenu._clockDisplay;
        this.signalId = this.clock.connect('notify::clock', () => this.updateClock());
        this.updateClock();
    }

    disable() {
        this.clock.disconnect(this.signalId);
        this.updateClock(this.systemTimeZone());
        this.signalId = null;
        this.clockDisplay = null;
        this.clock = null;
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
}

function init() {
    return new LocalDateTime();
}
