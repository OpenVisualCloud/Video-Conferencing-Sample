// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

// REST samples. It sends HTTP requests to sample server, and sample server sends requests to conference server.
// Both this file and sample server are samples.
'use strict';
var send = function (method, path, body, onRes, host) {
    var req = new XMLHttpRequest()
    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            onRes(req.responseText);
        }
    };
    let url = generateUrl(host, path);
    req.open(method, url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    if (body !== undefined) {
        req.send(JSON.stringify(body));
    } else {
        req.send();
    }
};

var generateUrl = function(host, path) {
    let url;
    if (host !== undefined) {
        url = host + path;  // Use the host user set.
    }else {
        let u = new URL(document.URL);
        url = u.origin + path;  // Get the string before last '/'.
    }
    return url;
}

var onResponse = function (result) {
    if (result) {
        try {
            console.info('Result:', JSON.parse(result));
        } catch (e) {
            console.info('Result:', result);
        }
    } else {
        console.info('Null');
    }
};

var mixStream = function (room, stream, view, host) {
    var jsonPatch = [{
        op: 'add',
        path: '/info/inViews',
        value: view
    }];
    send('PATCH', '/rooms/' + room + '/streams/' + stream, jsonPatch,
        onResponse, host);
};

var startStreamingIn = function (room, inUrl, host) {
    var options = {
        url: inUrl,
        media: {
            audio: 'auto',
            video: true
        },
        transport: {
            protocol: 'udp',
            bufferSize: 2048
        }
    };
    send('POST', '/rooms/' + room + '/streaming-ins', options, onResponse, host);
};

var createToken = function (room, user, role, callback, host) {
    var body = {
        preference: {isp: 'isp', region: 'region'},
        user: user,
        role: role
    };
    if (room) {
        send('POST', '/rooms/' + room + '/tokens/', body, callback, host);
    } else {
        send('POST', '/createToken/', body, callback, host);
    }
};

var getStreams = function (room, callback, host) {
    var resCb = function(result) {
        if (result) {
            try {
                callback(JSON.parse(result));
            } catch (e) {
                callback(null);
            }
        } else {
            callback(null);
        }
    };
    send('GET', '/rooms/' + room + '/streams/', undefined, resCb, host);
};

var pauseStream = function (room, stream, track, callback, host) {
    var jsonPatch = [];
    if (track === 'audio' || track === 'av') {
        jsonPatch.push({
            op: 'replace',
            path: '/media/audio/status',
            value: 'inactive'
        });
    }

    if (track === 'video' || track === 'av') {
        jsonPatch.push({
            op: 'replace',
            path: '/media/video/status',
            value: 'inactive'
        });
    }
    send('PATCH', '/rooms/' + room + '/streams/' + stream, jsonPatch, callback, host);
};

var playStream = function (room, stream, track, callback, host) {
    var jsonPatch = [];
    if (track === 'audio' || track === 'av') {
        jsonPatch.push({
            op: 'replace',
            path: '/media/audio/status',
            value: 'active'
        });
    }

    if (track === 'video' || track === 'av') {
        jsonPatch.push({
            op: 'replace',
            path: '/media/video/status',
            value: 'active'
        });
    }
    send('PATCH', '/rooms/' + room + '/streams/' + stream, jsonPatch, callback, host);
};
