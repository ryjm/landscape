# MVE talk

## Back End Setup

Pull the MVE arvo branch. This is our development branch that includes the latest `%collections` app and the necessary updates to `%clay` and `%ford`
```
git clone git@github.com:vvisigoth/arvo.git -b collections
```

### If you've got a ship running

If you've already got a ship running, copy the arvo files from the above repo into your pier.
```
cp -r /pulled/arvo/\* /your/ship/home
```

You have to reboot your ship, since we've changed some vanes.
In the `%dojo`, run:
```
|reboot
```

You should see messages iterating through all the vanes (ames, behn, clay, etc.)

Once this is done, make sure that you've started the collections app, by running:
```
|start %collections
```

Remember to run `|mount /===` in the dojo to make your `%home` desk visible to Unix.

### If you're starting a fakezod for development

If you're planning on developing with a fakezod, you can download our custom pill to incorporate changes to vanes
[DL Pill](https://drive.google.com/file/d/1N5Uxqy6n1GWxhApFsCoauPonFN9jhLtO/view?usp=sharing)

Now you can run the following command. This will start a fakezod using the specified arvo and pill
```
urbit -c -F -I zod -A <path to arvo repo> -B <path to pill> <destination dir>
```

Remember to run `|mount /===` in the dojo to make your `%home` desk visible to Unix.

## Front End Setup

Clone this repo.
```
git clone git@github.com:urbit/mockups
```

To get it running, you'll need to install Gulp globally:
```
npm install -g gulp
npm install
```

Copy ".urbitrc-sample" to a new file named ".urbitrc", and fill it with any configuration details:
  - `URBIT_PIERS` is an array of mounted "home" desks to output to. This will tell the build script where to place the bundled files.

Run the following to watch the `/src` directory and update the application bundle and copy it to your pier
```
gulp watch
```

Navigate to `localhost:8080/~~/pages/nutalk`. You may have to log into your ship (the `~~` means that you're authenticated)
