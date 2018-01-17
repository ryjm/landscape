# MVE talk

This repo powers the new Urbit web interface.

To get it running, you'll need to install Gulp globally:
> npm install -g gulp

Download this source code, and then run:

> npm install
> gulp watch

When you save a javascript file in /src, it will create a bundled application inside the /urbit-web-code folder.

## Running from your Urbit pier

You'll need to create a symlink to this repo's ./urbit-web-code from whichever pier your urbit is running from. This symlinks both the sail markup files (\*.hoon) and the actual bundled javascript (js/index.js) for easy, all-in-once place development.

If your urbit pier is in /root/urbit/samzod,
and this repo is in      /root/urbit/code/web,

Make sure the requisite folders exist, and then something like

> ln -s /root/urbit/code/web/urbit-web-code/ /root/urbit/samzod/home/web/pages/nutalk

Additionally, you need to copy over this repo's Arvo code to get the necessary HTML boilerplate running to load the pages.

Something like

> cp -r /root/urbit/code/web/urbit-code/* /root/urbit/samzod/home

The distinction between which code you symlink and which code you copy is fairly arbitrary. The symlinked code will update often, and the other code will not.

You might have to do some finagling with this symlink business; Clay sweeps out empty folders automatically, so you may need to touch a file in samzod/home/web/pages/nutalk for it to register the complete file path.

## Routing

MVE depends on a specific page structure currently, and for development purposes we access the code at

http://localhost:8080/~~/pages/nutalk

Hence symlinking the index.js to ~/web/pages/nutalk above. Other routing structures can work of course, this is just the easiest to get everything hooked up.

### Happy Talk-ing!
