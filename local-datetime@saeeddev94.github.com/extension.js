import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import GLib from 'gi://GLib';

export default class LocalDateTime extends Extension {

    enable() {
        this.clock = Main.panel.statusArea.quickSettings._date._clock;
        this.clockDisplay = Main.panel.statusArea.quickSettings._date._clockDisplay;
        this.signalId = this.clock.connect('notify::clock', () => this.updateClock());
        GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
            this.updateClock();
            return GLib.SOURCE_REMOVE;
        });
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
