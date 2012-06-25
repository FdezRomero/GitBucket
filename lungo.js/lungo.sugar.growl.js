/**
 * Growl Notification system in CSS3
 *
 * @namespace LUNGO.Sugar
 * @class Growl
 * @version 2.0
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

LUNGO.Sugar.Growl = (function(lng, undefined) {

    var _options = [];
    var _el = null;
    var _window = null;

    var DELAY_TIME = 1;
    var ANIMATION_MILISECONDS = 300;

    var SELECTOR = {
        BODY: 'body',
        GROWL: '.growl',
        MODAL: '.growl .window',
        MODAL_HREF: '.growl .window a',
        WINDOW_CLOSABLE: '.growl > .url .close',
        CONFIRM_BUTTONS: '.growl .confirm a.button'
    };

    var STYLE = {
        MODAL: 'modal',
        VISIBLE: 'visible',
        SHOW: 'show',
        WORKING: 'working',
        INPUT: 'input'
    };

    var CALLBACK_HIDE = 'LUNGO.Sugar.Growl.hide()';
    var MARKUP_GROWL = '<div class="growl"><div class="window"></div></div>';

    /**
     *
     */
    var show = function(title, description, icon, animate, seconds, callback) {
        _new_instance(true, animate);

        _show(_markup(title, description, icon));
        _hide(seconds, callback);
    };

    /**
     *
     */
    var hide = function() {
        _window.removeClass(STYLE.SHOW);
        setTimeout(function() {
            _el.style('display', 'none').removeClass('url').removeClass('confirm');
        }, ANIMATION_MILISECONDS);
    };

    /**
     *
     */
    var confirm = function(options) {
        _options = options;
        _new_instance(false);

        markup = '<p>' + _markup(options.title, options.description, options.icon) + '</p><hr/>';
        markup += _button_markup(options.accept, 'accept');
        markup += _button_markup(options.cancel, 'cancel');

        _window.addClass('special confirm');
        _show(markup);
    };

    /**
     *
     */
    var notify = function(title, description, icon, type, seconds, callback) {
        _new_instance(false);

        _window.addClass(type || 'info').addClass('special notify');
        _show(_markup(title, description, icon));
        _hide(seconds, callback);
    };

    /**
     *
     */
    var html = function(markup, closable) {
        _new_instance(true);

        _window.addClass('url');
        markup += (closable) ? '<span class="icon close"></span>' : '';
        _show(markup);
    };

    var _init = function() {
        lng.dom(SELECTOR.BODY).append(MARKUP_GROWL);
        _el = lng.dom(SELECTOR.GROWL);
        _window = _el.children('.window');

        _subscribeEvents();
    };

    var _new_instance = function(modal, animate) {
        _el.style('display') === 'none' && _el.show();
        modal && _el.addClass(STYLE.MODAL) || _el.removeClass(STYLE.MODAL);

        _window.removeClass(STYLE.SHOW).removeClass(STYLE.WORKING);
        _window.removeClass('url').removeClass('notify').removeClass('confirm').removeClass('special');
        _window.removeClass('error').removeClass('alert').removeClass('success');
        if (animate) {
            _window.addClass(STYLE.WORKING);
        }
    };

    var _show = function(html) {
        _window.html(html);
        setTimeout(function() {
            _window.addClass(STYLE.SHOW);
        }, DELAY_TIME);
    };

    var _hide = function(seconds, callback) {
        if (seconds !== undefined && seconds !== 0) {
            var miliseconds = seconds * 1000;
            setTimeout(function() {
                hide();
                if (callback) setTimeout(callback, ANIMATION_MILISECONDS);
            }, miliseconds);
        }
    };

    var _markup = function(title, description, icon) {
        return '<span class="icon ' + icon + '"></span><strong>' + title + '</strong><small>' + description + '</small>';
    };

    var _button_markup = function(options, callback) {
        return '<a href="#" data-callback="' + callback + '" class="button ' + options.color + '" data-icon="' + options.icon + '">' + options.label + '</a>';
    };

    var _subscribeEvents = function() {
        _window.tap(function(event) {
            if (_window.hasClass('notify')) {
                hide();
            }
        });

        lng.dom(SELECTOR.CONFIRM_BUTTONS).tap(function(event) {
            var button = lng.dom(this);
            var callback = _options[button.data('callback')].callback;
            if (callback) callback.call(callback);
            hide();
        });

        lng.dom(SELECTOR.WINDOW_CLOSABLE).tap( hide );
    };

    _init();

    return {
        show: show,
        notify: notify,
        confirm: confirm,
        html: html,
        hide: hide
    };

})(LUNGO);