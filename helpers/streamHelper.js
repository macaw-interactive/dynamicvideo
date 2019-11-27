"use strict";

var fs = require("fs");
let ffmpeg = require('fluent-ffmpeg');
const FileHelper = require('./fileHelper');
const Logger = require('./logger');

class StreamHelper {

    /**
     *
     */
    constructor() {
        this.fileHelper = new FileHelper();
        this._sceneList = this._getSceneList();
    }

    /**
     * Get all the subdirectories (as tags) and their source files from the video directory.
     *
     * @returns {Array} The source files with the tag
     */
    _getSceneList() {
        if (!global.rootDirectory) {
            throw new Error('Global variable rootDirectory is not set.');
        }

        return this.fileHelper.getAllFilesFromFolder(global.rootDirectory + "/video");
    }

    /**
     *
     */
    startStreaming(sessionId, questionnaire) {
        if (!global.rootDirectory) {
            throw new Error('Global variable rootDirectory is not set.');
        }

        this.fileHelper.buildRootPlaylist(sessionId);
        const t = this;

        // TODO: after refresh this gives an error. Maybe the URL random per session?
        // ALSO: after session, the ffmpeg session should be ended

        // https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
        ffmpeg(global.rootDirectory + '/video/' + sessionId + '.txt')
            .inputOptions(
                '-re'
            )
            .addOptions([
                '-f flv'
            ])
            .output('rtmp://localhost/live/' + sessionId)
            .noAudio()
            .videoCodec('libx264') //otherwise it stops after first vid
            .on('error', function (s) {
                Logger.error('Error on ffmpeg process');
                console.trace(s);
            })
            .on('end', function () {
                Logger.info('Merging finished !');
            }).on('start', function (command) {
            t.setSceneChanger(command, sessionId, questionnaire)
        })
            .run();


    }

    /**
     *
     * @param commandLine
     * @param sessionId
     * @param questionnaire
     */
    setSceneChanger(commandLine, sessionId, questionnaire) {
        Logger.info('Spawned Ffmpeg with command: ' + commandLine)
        Logger.info(sessionId);

        let t = this;


        let counter = 12000; // milliseconds
        let changer = function () {
            let tag = questionnaire.tagList.getBestTag();

            tag.playCount++;
            t.changeScene(tag, sessionId);

            Logger.table(questionnaire.tagList.all());

            timeout = setTimeout(changer, counter);
        };

        let timeout = setTimeout(changer, counter);

    }


    /**
     * Changes the scene
     *
     * @param tag
     * @param sessionId
     *
     * @returns {boolean} true if a scene is available, false if not
     */
    changeScene(tag, sessionId) {
        if (!global.rootDirectory) {
            throw new Error('Global variable rootDirectory is not set.');
        }

        if (typeof tag === 'object') {
            tag = tag.title; // TODO: dirty workaround
        }

        // Filter list on tag
        const newList = this.sceneList.filter(function (a) {
            return a.tag === tag;
        });

        // return false if list is empty
        if (!(newList.length > 0)) {
            Logger.warn('There are no available videos to play for tag "' + tag + '".')
            return false;
        }

        // Build text for playlist file
        let text = 'ffconcat version 1.0';
        for (let l in newList) {
            text += '\nfile ' + newList[l].tag + '/' + newList[l].file;
        }

        this.fileHelper.changeFileContents(global.rootDirectory + '/video/' + sessionId + '_playlist.txt', text);

        return true;
    }


    get fileHelper() {
        return this._fileHelper;
    }

    set fileHelper(value) {
        this._fileHelper = value;
    }

    get sceneList() {
        return this._sceneList;
    }

    set sceneList(value) {
        this._sceneList = value;
    }
}

module.exports = StreamHelper;
