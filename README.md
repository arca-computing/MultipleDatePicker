[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/arca-computing/MultipleDatePicker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

#What's new ?

###Version 2.0.7
Fixed a problem with ngAnimate and css #54

###Version 2.0.6
Now watch `month` so if you change it, calendar will update. Should have done it a long time ago :)

###Version 2.0.5
New option to quickly change year `change-year-past` & `change-year-future`

Updated demo page too

###Version 2.0.4
Fixed #59 - Now you can disable the navigation with `disable-navigation`

Updated demo page too

###Version 2.0.3
Fixed #60 - Now listen to moment.locale change so change month and days labels.

Updated demo page too

###Major version 2.0.0
Fixing #50 and giving the directive a much better way to get/pass dates or interact with it : `ngModel`. 

I removed the way to reset a datepicker, because of the ngModel, no need of complex broadcast with ids, that was a silly id of me :)

I also removed the bower script to use gulp, much better to me.

Minor fixes will come to improve again the directive and documentation.

Check the demo !

###Version 1.4.1
Fixed #44
 
###Version 1.4.0
Removed deprecated functions and updates package.json.

###Version 1.3.4
Added `disableDaysBefore` and `disableDaysAfter`. Check the demo.

###Version 1.3.3
Improving `showDaysOfSurroundingMonths` with `cssDaysOfSurroundingMonths` and `fireEventsForDaysOfSurroundingMonths`. Check the demo.

###Version 1.3.2
Adding `showDaysOfSurroundingMonths`. Check the demo.

###Version 1.3.1
Adding MIT LICENSE :)

###Version 1.3.0
Adding `multipleDatePickerBroadcast` to broadcast orders to calendar. Check the demo.

###Version 1.2.1
Merged [PR#35](https://github.com/arca-computing/MultipleDatePicker/pull/35) to add past and future classes to dates

###Version 1.2.0
From a good idea of [Asopus](https://github.com/Asopus) I added a new property : **highlight-days** so **days-off** becomes deprecated.

As usual, check the demo page [http://arca-computing.github.io/MultipleDatePicker/](http://arca-computing.github.io/MultipleDatePicker/)
###Version 1.1.6
Fixed an unselection problem

###Version 1.1.X
Some bugs fix and improvements, check demo

###Version 1.1.0
[Soyuka](https://github.com/soyuka) improved the library, you now have events in your callback, so you can play with it. He also add a new callback when you over a day. Check out the demo page !

The parameter "callback" has been deprecated, it's still working but will be removed in a next version, please update.

#What is MultipleDatePicker ?
MultipleDatePicker is an Angular directive to show a simple calendar allowing user to select multiple dates, a callback is called, you can specify some off days or already selected days.

#Install and demo
[http://arca-computing.github.io/MultipleDatePicker/](http://arca-computing.github.io/MultipleDatePicker/)

#They use it
![EatStreet](http://eatstreet.com/redesign/img/svg/svg-logo-alternate.svg) [eatstreet.com](https://eatstreet.com)

You use it too ? Tell us [here on Gitter](https://gitter.im/arca-computing/MultipleDatePicker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) or [open an issue](https://github.com/arca-computing/MultipleDatePicker/issues)

#What's next ?
We created this directive to have a simple calendar with multi-dates selection. We will keep it simple but any improvement is welcome.
