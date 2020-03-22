const St           = imports.gi.St;
const Main         = imports.ui.main;
const PanelMenu    = imports.ui.panelMenu;
const PopupMenu    = imports.ui.popupMenu;
const Slider       = imports.ui.slider;
const myExt        = imports.misc.extensionUtils.getCurrentExtension();
const Gio          = imports.gi.Gio;

let btn, overlay, popup, numEntry, slider;

function refreshOverlay(val) {
    if (!overlay) {
        overlay = new St.Label({ style_class: 'screen-overlay-actor', text: null });
        Main.uiGroup.add_actor(overlay);
    }

    overlay.opacity = val || 0;

    let monitor = Main.layoutManager.primaryMonitor;

    overlay.set_position(0, 0);
    overlay.set_width(monitor.width * 6);
    overlay.set_height(monitor.height + 500);
}

function init() {}

function enable() {
    popup = new PopupMenu.PopupBaseMenuItem({
        reactive: false,
        can_focus: false
    });

    slider = new Slider.Slider(0);

    popup.actor.add(slider, { expand: true });

    let box = new St.BoxLayout();

    let icon = new St.Icon({
        style_class: 'brightness-overlay-icon'
    });

    box.add(icon);
    // box.add(PopupMenu.arrowIcon(St.Side.BOTTOM));

    btn = new PanelMenu.Button(0.0, _("Brightness Overlay"), false);

    btn.actor.add_child(box);
    btn.actor.visible = true;

    btn.menu.addMenuItem(popup);

    popup.actor.connect('button-press-event',
      (actor, event) => slider.startDragging(event));

    popup.actor.connect('key-press-event',
      (actor, event) => slider.onKeyPressEvent(actor, event));

    slider.connect('notify::value', function(slider) {
        const bri = parseInt(slider.value * (240 - 0)) + 0;
        global.log("skap.val.change: " + bri);
        refreshOverlay(bri);
    });

    Main.panel.addToStatusArea('Brightness Overlay', btn, 0, 'right');
}

function disable() {
    btn.destroy();
}