[![Build status](https://dev.azure.com/MacawInteractive/DynamicVideo/_apis/build/status/DynamicVideo-CI)](https://dev.azure.com/MacawInteractive/DynamicVideo/_build/latest?definitionId=15)
#Dynamic Video
> A proof of concept which shows the possibilities for changing a streaming video on the server directly from the browser.

## Features
- Automatically installs FFmpeg within the project
- Chooses video based on the given answers

## Prerequisites
You must have the following software installed:
- npm

## Installation
Rename (or copy) `.env.example` to `.env` and change it according to your needs.
Some video's are needed. They can be placed in the `video` folder. A `default` folder within the video folder is required to play the first scene.

After setting up the environment variables and add videos to the `video` folder, you can run the following commands to
install everything and run the program.
```bash
npm install
npm start
```

When developing, you can use `nodemon start` instead of `npm start` so the application will automatically
restart when there is a change detected while developing.

## Environment
There are different environment variables you can set. The variables are located in the `.env` file in the root folder of this project.

### Explanation


## Data
The data is provided in the `data` folder. The main data file is `data.json`, while the other files are there for test purposes.
There are some requirements attached to the data. This will also be tested with the tests within the project.
The data.json file should be structured like this:
- questions `array:question`
- answers `array:answer`

The questions array should contain only questions. Every question is an object and structured as follows:
- id `int`
- desc `string`
- answers `array:answer`

The answers array should contain only answers. Every answer is an object and structured as follows:
- id `int`
- desc `string`
- tags `array:string`

The array with videos will attach the tags to video files.
- source `string`
- tags `array:string`


## Videos
The videos are stored in the `video` folder with the following file structure:
- 1.mp4
- video_2.mp4
- 3rd-video.mp4
- `<generated_hash>.txt`
- `<generated_hash_playlist.txt>`

At the moment of writing, subdirectories are not supported.
The `video` files have to correspond with the video sources used in the data.json.
The `<generated_hash>` files are playlist files for FFmpeg which are automatically generated.

The filename of the videos cannot contain any spaces!
For more information about the videos, check the [videos](videos.md) readme.

## Possible improvements
- Use WebRTC for lower latency (lol)

## Known bugs
- After a page refresh FFmpeg wants to stream the video to the the previous session URL

## Contact
If you have any questions regarding this project, feel free to contact me

Dennis Volkering