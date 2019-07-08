/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["css/styles.css","cea5d671382bef65e629713c550daa98"],["img/arrow.png","bb90bd787f14b3f989e5eb44506b8888"],["img/audio.png","d9edaf4bca00dd837577bcb7cf6311ab"],["img/avatar.png","0c0d4507c5626af67003f16bacacc536"],["img/avatar_p1.png","2a21af548c7e1554de9dab0acd6dd211"],["img/avatar_p2.png","be9cc27caad7a846d7ec3db2c0ed2ff1"],["img/avatar_p3.png","df7c784783891b72ab65f15224527055"],["img/ban_camera.jpg","326dabf5de53bda8e43ac0a2f544a860"],["img/camera.png","fabf430e433d07946bc98004a58f3dae"],["img/checked.png","ae7cdeff6f391f07684d460b13d701ab"],["img/close.png","11b6cb089c7f154eafe7b00f519eb20c"],["img/enlarge.png","5e4dd15da727b64b3539074222b61542"],["img/fullscreen.png","ba6293d152d3e5d870d17b26ca452d5d"],["img/galaxy.png","53eb37cf4e51b0e71adb18c2b857a0b4"],["img/galaxy2.png","e2d745c7555d6c84eabb316ee523dd40"],["img/im.png","b1963d335a3f493b72e0a61256b1e845"],["img/im2.png","f4ef40d72c915cf49c32627d7e39a5ee"],["img/lecture.png","bd43610c3d482017253dee51e8f5b28f"],["img/lecture2.png","9bfd02b888f6a6070b8c2b83487767ff"],["img/monitor.png","f1ebe62e9eb00333c1e9b04cf186ccd3"],["img/monitor2.png","76d05f7029c1d7631592b10dce63d1b1"],["img/mute-voice.png","e251ad8c8abbdcd87278965f24e04f58"],["img/mute.png","6295c5cd45bf215d32d7c446bab2055f"],["img/mute_white.png","9287be27d5d85e2d7b7dcba6068c8c2b"],["img/original.png","34186dcc12f0eed0e8886c6407a88915"],["img/return.png","051b7b68d70e5b13096de046cb25e0fd"],["img/screen.png","f2c0d6ed5160c5e27b9e26d1bacff249"],["img/screen2.png","55e21ecb8c97d610fdc4295f0df459fc"],["img/shrink.png","95fe0ed8b4aec42a7cce2dea0e39b5cf"],["img/turn-video.png","84bceba1e2b16ebd73681472deb5f7b3"],["img/unmute-voice.png","d9edaf4bca00dd837577bcb7cf6311ab"],["img/unmute.png","240acf8cb73b82f4bfa17d05d405af78"],["img/unmute_white.png","8d73b348317cb979d9cffdc452117d15"],["img/video.png","49c3f96bdf4302e68b02858963e99d44"],["img/web-sample.jpg","3350c17cb8f28eed13f903af42c87724"],["img/wifi0.png","6e118393d46f23ac848ac85edd369cb5"],["img/wifi1.png","df709c67f5c5957c23bb5fff1d0eaf2d"],["img/wifi2.png","947e2f6210711578dd63775b938ae9b7"],["img/wifi3.png","ae3c54d7ce8c2e4f0531aaea20a55e87"],["img/wifi4.png","b77c9d6002ee722e09a526e6f34c0355"],["index.html","d93bce252c26ee6af0e31ce9e2041415"],["js/index.js","d8ee8ace08b505753d941f69121ecbc0"],["js/owt.js","fc236e1258f7281b6ebe7fed4c6bfc53"],["js/rest.sample.js","2520a7c11b0c3369c38ddc7b5ef312b3"],["pwa/android-chrome-192x192.png","988083d704c4abeff3d10caf8f672f99"],["pwa/android-chrome-512x512.png","afd2c866f69c1a2712b6b7f719c67996"],["pwa/apple-touch-icon.png","c793faccd789c299473d5b8ed9658d89"],["pwa/browserconfig.xml","c801dc4cbfcd85e7a3f66bada66f48b6"],["pwa/favicon-16x16.png","2bdf0cd3725cd5847b5e22c4a578d0b7"],["pwa/favicon-32x32.png","3a2fbad6f39c0591e0c50ba33160ccc3"],["pwa/favicon.ico","f3f70846cad486fc894f0d6145364266"],["pwa/favicon_package_v0.16.zip","1e8942e25cbc0f1cdd4a2dfb309c209e"],["pwa/manifest.json","6ffc65b32805b384592383b7d5f64adf"],["pwa/mstile-150x150.png","bd73ca6f77cdcf4511f9b598a96eeb59"],["pwa/safari-pinned-tab.svg","b3aae41d39e7e23421e5eac20f47d057"],["pwa/site.webmanifest","6069acd6b7bd179fa3c56a616f03caa9"]];
var cacheName = 'sw-precache-v3-sw-precache-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







