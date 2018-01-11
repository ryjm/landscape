# SLC (working title)

This repo powers the new Urbit web interface.

To get it running, you'll need to install Gulp globally:
> npm install -g gulp

Download this source code, and then run:

> npm install
> gulp watch

## Running from your Urbit pier

You'll need to create a symlink to the generated index.js file in this repo's dist/ folder (after running 'gulp' or 'gulp watch') from whichever pier your urbit is running from.

If your urbit pier is in /root/urbit/samzod,
and this repo is in      /root/urbit/code/web,

You'll write something like

> ln -s /root/urbit/code/web/dist/js/index.js /root/urbit/samzod/home/web/pages/nutalk

Additionally, you need to copy over this repo's Arvo code to get the necessary HTML boilerplate running to load the pages.

Something like

> cp -r /root/urbit/code/web/urbit-code/* /root/urbit/samzod/home

## Routing

SLC depends on a specific page structure currently, and for development purposes we access the code at

http://localhost:8080/~~/pages/nutalk

Hence symlinking the index.js to ~/web/pages/nutalk above. Other routing structures can work of course, this is just the easiest to get everything hooked up.

### Happy Talk-ing!
