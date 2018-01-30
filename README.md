# MVE talk

*Note* this assumes that you've got an Urbit ship running and that you've run `|mount /=home=` in the `%dojo`. This mounts your pier to the Unix filesystem.

## Back End Setup

Pull the MVE arvo branch. This is a branch that includes the latest `%collections` app and the necessary updates to `%clay` and `%ford`
> git clone git@github.com:vvisigoth/arvo.git -b mve-ui
*Note* This shuold be updated to pull the mve branch of urbit/arvo 

Copy the arvo files from the above repo into your pier.
> cp -r /pulled/arvo/\* /your/ship/home

You have to reboot your ship, since we've changed some vanes.
In the `%dojo`, run:
> |reboot

You should see messages iterating through all the vanes (ames, behn, clay, etc.)

## Front End Setup

Clone this repo.
> git clone git@github.com:urbit/mockups

To get it running, you'll need to install Gulp globally:
> npm install -g gulp
> npm install

Update the `gulpfile.js` with the path to your pier. This will tell the build script where to place the bundled files.

Run the following to watch the /src directory and update the application bundle and copy it to your pier
> gulp watch

Navigate to `localhost:8080/~~/pages/nutalk`. You may have to log into your ship (the `~~` means that you're authenticated)


