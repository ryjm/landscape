# Landscape

Landscape is an agent for running cities on top of Arvo. 

In English, it's a web application with basic chat and forum functionality.

## Running Landscape

Landscape is automatically packaged with your ship when you instantiate it. Just pop open localhost on your ship's web port (printed to your terminal when you boot your ship) to get started. 

## Quick User Guide 

- `cmd + k` opens the menu. Type '?' for an explanation of the various commands.
- You'll need to be invited to a city to do anything with Landscape currently. Request access at `support@urbit.org`
- Security has not yet been vetted; assume only security through obscurity.

## Developing Landscape 

Our internal frontend development guide, Kamaji, will be published soon. Stay tuned.

### Quick start

Create a `.urbitrc` file in this directory like so:

```
module.exports = {
    URBIT_PIERS: [
      "/path/to/fakezod/home"
    ]
};
```

You'll need `npm` installed. Then:

```
npm install
gulp watch
```

Whenever you change some landscape source code, this will recompile the code and
copy the updated version into your fakezod pier.

### NixOS dev

If on NixOS, try:

```
nix-shell -p nodejs-8_x
npm install
export PATH=./node_modules/.bin/:$PATH
gulp watch
```
