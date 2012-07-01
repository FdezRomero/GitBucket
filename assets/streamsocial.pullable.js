/**
 * Pullable: A pull-to-refresh sugar for LungoJS
 *
 * @namespace LUNGO.Sugar
 * @class Pullable
 * @version 1.0
 *
 * @author Rodrigo Fernández-Romero <fdez.romero@streamsocial.com> || @FdezRomero
 */

LUNGO.Sugar.Pullable = (function(lng, undefined) {
    
    var Create = function() {
        var found_el = lng.dom('.pullable');
        for (var i=0; i < found_el.length; i++) {
            var article_id = lng.dom(found_el[i]).attr('id');
            _Init(article_id);
        }
    };

    var _Init = function(article) {

        Empty(article);

        var has_down = lng.dom('#'+article).hasClass('down');
        var has_up = lng.dom('#'+article).hasClass('up');

        // Setting up offsets
        if (has_down) {
            var pullDownEl = lng.dom('#'+article+' .pullDown').get(0);
            var pullDownOffset = pullDownEl.offsetHeight;
        }
        if (has_up) {
            var pullUpEl = lng.dom('#'+article+' .pullUp').get(0);
            var pullUpOffset = pullUpEl.offsetHeight;
        }

        var myScroll = new iScroll(article, {
            hScroll: false,
            hScrollbar: false,
            vScrollbar: false,
            useTransition: true,
            topOffset: pullDownOffset,
            
            onRefresh: function () {
                if (has_down && pullDownEl.className.match('loading')) {
                    pullDownEl.className = 'pullDown';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                
                } else if (has_up && pullUpEl.className.match('loading')) {
                    pullUpEl.className = 'pullUp';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
                }
            },
            onScrollMove: function () {
                if (has_down && this.y > 5 && !pullDownEl.className.match('flip')) {
                    App.Utils.Arrow1Sound();
                    pullDownEl.className = 'pullDown flip';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
                    this.minScrollY = 0;
                } else if (has_down && this.y < 5 && pullDownEl.className.match('flip')) {
                    App.Utils.Arrow1Sound();
                    pullDownEl.className = 'pullDown';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                    this.minScrollY = -pullDownOffset;
                
                } else if (has_up && this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                    App.Utils.Arrow1Sound();
                    pullUpEl.className = 'pullUp flip';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to load more...';
                    this.maxScrollY = this.maxScrollY;
                } else if (has_up && this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                    App.Utils.Arrow1Sound();
                    pullUpEl.className = 'pullUp';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
                    this.maxScrollY = pullUpOffset;
                }
            },
            onScrollEnd: function () {
                if (has_down && pullDownEl.className.match('flip')) {
                    App.Utils.Arrow2Sound();
                    pullDownEl.className = 'pullDown loading';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
                    App.Events.PullDownAction(article, myScroll); // Execute event callback function
                
                } else if (has_up && pullUpEl.className.match('flip')) {
                    App.Utils.Arrow2Sound();
                    pullUpEl.className = 'pullUp loading';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';
                    App.Events.PullUpAction(article, myScroll); // Execute event callback function
                }
            }
        });

        // Store the reference in the cache
        lng.Data.Cache.set('pullable_'+article, myScroll);
    };

    var Empty = function(article) {

        // Check for pullables and embed their code
        var html_down = (lng.dom('#'+article).hasClass('down')) ? '<div class="pullDown"><span class="pullDownIcon"></span>\
            <span class="pullDownLabel">Pull down to refresh...</span></div>' : '';
        var html_up = (lng.dom('#'+article).hasClass('up')) ? '<div class="pullUp"><span class="pullUpIcon"></span>\
            <span class="pullUpLabel">Pull up to load more...</span></div>' : '';

        // Insert the Pullable HTML code if not present
        if (lng.dom('#'+article).html() == '<ul></ul>') {
            // Append the fix if the article has a footer and it's visible
            var fix = (article.substr(0,5) == 'repo-') ? '<div class="scrollFix"></div>' : '';
            lng.dom('#'+article).html('<div>'+html_down+'<ul></ul>'+html_up+fix+'</div>');
        } else {
            lng.dom('#'+article+' ul').empty();
        }
    };

    var Stop = function(article) {
        
        // Revert the Pullables to their initial state
        if (lng.dom('#'+article).hasClass('down')) {
            App.Utils.PopSound();
            var pullDownEl = lng.dom('#'+article+' .pullDown').get(0);
            pullDownEl.className = 'pullDown';
            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
        }
        if (lng.dom('#'+article).hasClass('up')) {
            App.Utils.PopSound();
            var pullUpEl = lng.dom('#'+article+' .pullUp').get(0);
            pullUpEl.className = 'pullUp';
            pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
        }
        Refresh(article);
    };

    var Refresh = function(article) {
        var myScroll = lng.Data.Cache.get('pullable_'+article);
        myScroll.refresh();
    };

    return {
        Create: Create,
        Empty: Empty,
        Stop: Stop,
        Refresh: Refresh
    };

})(LUNGO);