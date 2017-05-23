(function(window) {
    var tdv = {};

    tdv.buildDependencyTree = function(boardName, epics, cards) {
        var links = [
            {source: boardName, target: ''}
        ];
        var epicIdsShortcuts = {};
        epics.forEach(epic => {
            var link = tdv.extractLinkFromCard(epic);
            if (typeof link === 'undefined') {
                epicIdsShortcuts[epic.id] = epic;
                links.push({source: epic.name, target: boardName, url: epic.url});
            }
        });


        var cardsIdsShortcuts = {};
        cards.forEach(card => {
            cardsIdsShortcuts[card.url] = card;
            cardsIdsShortcuts[card.shortUrl] = card;
            cardsIdsShortcuts[card.id] = card;
            cardsIdsShortcuts[card.shortLink] = card;
        });

        cards.forEach(card => {
            if (!epicIdsShortcuts.hasOwnProperty(card.id)) {
                var link = tdv.extractLinkFromCard(card);
                if (typeof link !== 'undefined') {
                    var target = cardsIdsShortcuts[link];
                    if (typeof target !== 'undefined') {
                        links.push({target: target.name, source: card.name, url: card.url})
                    }
                }
            }
        });
        return links;
    };

    tdv.extractEpicList = function(lists) {
        for (var i = 0; i < lists.length; i++) {
            var list = lists[i];
            if (list.name.toLowerCase().indexOf('epic') !== -1) {
                return list;
            }
        }
    };

    function getShortUrl(url) {
        var newUrl = url;
        while (newUrl.split('/').slice(5).length > 0) {
            newUrl = newUrl.substring(0, newUrl.lastIndexOf('/'));
        }
        return newUrl;
    }

    function extractLinksFromString(string) {
        var matches = [];
        var parentRegex = /^.*Link\s*:\s*(\S+)/mgi;
        var match = parentRegex.exec(string);
        while (match !== null) {
            matches.push(getShortUrl(match[1]));
            match = parentRegex.exec(string);
        }
        return matches;
    }


    tdv.extractLinksFromCard = function(card) {
        return extractLinksFromString(card.desc);
    };

    tdv.extractLinkFromCard = function(card) {
        var links = extractLinksFromString(card.desc);
        if (links.length > 0) {
            return links[0]
        }
    };

    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = tdv;
    }
    else {
        window.tdv = window.$ = tdv;
        if (typeof define === "function" && define.amd) {
            define("tdv", [], function() {
                return tdv;
            });
        }
    }
})(this);