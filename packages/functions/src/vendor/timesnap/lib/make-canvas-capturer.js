/**
 * BSD 3-Clause License
 *
 * Copyright (c) 2018-2020, Steve Tung
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * * Neither the name of the copyright holder nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const { makeFilePathConverter, writeFile } = require('./utils.js');
const path = require('path');

const defaultCanvasCaptureMode = 'png';

module.exports = function makeCanvasCapturer(canvasToBuffer) {
  return function (config) {
    var page = config.page;
    var log = config.log;
    var frameProcessor = config.frameProcessor;
    var filePathConverter = makeFilePathConverter(config);
    var canvasCaptureMode = config.canvasCaptureMode;
    var canvasSelector = config.selector || 'canvas';
    var pendingWritePromises = [];
    var waitForWriting = false;
    var framesToCapture = config.framesToCapture;
    var quality = config.screenshotQuality;
    var filePath = filePathConverter(1, framesToCapture);
    if (typeof canvasCaptureMode !== 'string' || !canvasCaptureMode) {
      canvasCaptureMode = config.screenshotType;
      if (!canvasCaptureMode && filePath) {
        canvasCaptureMode = path.extname(filePath).substring(1);
      }
      if (!canvasCaptureMode) {
        canvasCaptureMode = defaultCanvasCaptureMode;
      }
    }
    if (!canvasCaptureMode.startsWith('image/')) {
      canvasCaptureMode = 'image/' + canvasCaptureMode;
    }
    if (canvasCaptureMode === 'image/jpg') {
      canvasCaptureMode = 'image/jpeg';
    }
    return {
      canvasCaptureMode,
      canvasSelector,
      quality,
      capture: function (sameConfig, frameCount) {
        filePath = filePathConverter(frameCount, framesToCapture);
        log('Capturing Frame ' + frameCount + (filePath ? ' to ' + filePath : '') + '...');
        var p = canvasToBuffer(page, canvasSelector, canvasCaptureMode, quality);
        if (filePath) {
          p = p.then(function (buffer) {
            var writePromise = writeFile(filePath, buffer);
            if (waitForWriting) {
              return writePromise.then(function () {
                return buffer;
              });
            } else {
              pendingWritePromises.push(writePromise);
              return buffer;
            }
          });
        }
        if (frameProcessor) {
          p = p.then(function (buffer) {
            return frameProcessor(buffer, frameCount, framesToCapture);
          });
        }
        return p;
      },
      afterCapture: function () {
        return Promise.all(pendingWritePromises);
      }
    };
  };
};
