import test from 'ava';
import trello from './trello'

test('extractEpicList', t => {
    const lists = [
        {
            "id": "e90c1521e1fc798c845f2157",
            "name": "Pending (Blocked)",
            "closed": false,
            "idBoard": "14522f11e101269c246e9f41",
            "pos": 57343.125,
            "subscribed": false
        },
        {
            "id": "518e1e4cc51979f2406221f1",
            "name": "Epic",
            "closed": false,
            "idBoard": "f524e3ec9061e0774b12f07c",
            "pos": 8191.875,
            "subscribed": false
        }
    ];
    t.is(trello.extractEpicList(lists).id, lists[1].id)
});

test('extractLinkFromCard', t => {
    const card = {
        "id": "fc798c845f2157e90c1521e1",
        "checkItemStates": null,
        "closed": false,
        "dateLastActivity": "2017-05-17T14:53:13.824Z",
        "desc": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam amet atque cupiditate debitis dolor eligendi est eum, excepturi itaque libero nihil nulla omnis, praesentium rem sequi similique tempora tenetur, veritatis.\n\n Link: https://trello.com/c/cdDfI9KU/420-epic-card\n",
        "descData": {
            "emoji": {}
        },
        "idBoard": "14522f11e101269c246e9f41",
        "idList": "e90c1521e1fc798c845f2157",
        "idMembersVoted": [],
        "idShort": 552,
        "idAttachmentCover": null,
        "manualCoverAttachment": false,
        "idLabels": [],
        "name": "Trello card",
        "pos": 5632,
        "shortLink": "1p0USoBe",
        "badges": {
            "votes": 0,
            "viewingMemberVoted": false,
            "subscribed": false,
            "fogbugz": "",
            "checkItems": 0,
            "checkItemsChecked": 0,
            "comments": 0,
            "attachments": 0,
            "description": true,
            "due": null,
            "dueComplete": false
        },
        "dueComplete": false,
        "due": null,
        "idChecklists": [],
        "idMembers": [],
        "labels": [],
        "shortUrl": "https://trello.com/c/1p0USoBe",
        "subscribed": false,
        "url": "https://trello.com/c/1p0USoBe/552-trello-card"
    };
    t.is(trello.extractLinksFromCard(card)[0], 'https://trello.com/c/cdDfI9KU/420-epic-card');
    t.is(trello.extractLinkFromCard(card), 'https://trello.com/c/cdDfI9KU/420-epic-card');
});

test('buildDependencyTree', t => {
    var boardName = 'DCI';
    let e1 = {
        name: 'e1',
        desc: '',
        url: 'https://example.org/e1',
        shortUrl: 'https://example.org/e1',
        id: 'e1',
        shortLink: 'e1'
    };
    let e2 = {
        name: 'e2',
        desc: 'Link: https://example.org/e1',
        url: 'https://example.org/e2',
        shortUrl: 'https://example.org/e2',
        id: 'e2',
        shortLink: 'e2'
    };
    var epics = [e1, e2];
    var cards = [
        e1,
        e2,
        {
            name: 'c1',
            desc: 'Link: https://example.org/e1',
            url: 'https://example.org/c1',
            shortUrl: 'https://example.org/c1',
            id: 'c1',
            shortLink: 'c1'
        },
        {
            name: 'c2',
            desc: 'Link: https://example.org/c1',
            url: 'https://example.org/c2',
            shortUrl: 'https://example.org/c2',
            id: 'c2',
            shortLink: 'c2'
        }
    ];
    var expectedTree = [
        {source: 'DCI', target: ''},
        {source: 'e1', target: 'DCI'},
        {source: 'e2', target: 'e1'},
        {source: 'c1', target: 'e1'},
        {source: 'c2', target: 'c1'}
    ];

    t.deepEqual(trello.buildDependencyTree(boardName, epics, cards), expectedTree);
});