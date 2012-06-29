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

        var pullDownEl = lng.dom('#'+article+' .pullDown').get(0);
        var pullDownOffset = pullDownEl.offsetHeight;

        var myScroll = new iScroll(article, {
            hScroll: false,
            hScrollbar: false,
            vScrollbar: false,
            snap: 'li',
            useTransition: true,
            topOffset: pullDownOffset,
            onRefresh: function () {
                if (pullDownEl.className.match('loading')) {
                    pullDownEl.className = 'pullDown';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                }
            },
            onScrollMove: function () {
                if (this.y > 5 && !pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'pullDown flip';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
                    this.minScrollY = 0;
                } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'pullDown';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                    this.minScrollY = -pullDownOffset;
                }
            },
            onScrollEnd: function () {
                if (pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'pullDown loading';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
                    App.Events.PullDownAction(article, myScroll); // Execute callback function (ajax call?)
                }
            }
        });

        // Store the reference in the cache
        lng.Data.Cache.set('pullable_'+article, myScroll);
    };

    var Empty = function(article) {
        // Insert the PullDown HTML code if not present
        if (lng.dom('#'+article).html() == '<ul></ul>') {
            // Append the fix if the article has a footer and it's visible
            var fix = (article.substr(0,5) == 'repo-') ? '<div class="pullFix"></div>' : '';
            lng.dom('#'+article).html('<div><div class="pullDown"><span class="pullDownIcon"></span>\
            <span class="pullDownLabel">Pull down to refresh...</span></div><ul></ul>'+fix+'</div>');
        } else {
            lng.dom('#'+article+' ul').empty();
        }
    };

    var Stop = function(article) {
        // Revert the PullDown to its initial state
        var pullDownEl = lng.dom('#'+article+' .pullDown').get(0);
        pullDownEl.className = 'pullDown';
        pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
        
        var myScroll = lng.Data.Cache.get('pullable_'+article);
        myScroll.refresh();
    };

    return {
        Create: Create,
        Empty: Empty,
        Stop: Stop
    }
})(LUNGO);