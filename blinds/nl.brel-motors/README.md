
Forked "Brel Motors" to use as example and made changes to manage to 
control Forest-TCS curtain-rails (older rails before Forest-Shuttle)



#Brel Motors

Adds support for remote controlled motors for roller blinds produced by Brel Motors

If you experience issues please submit the issue at https://github.com/athombv/homey/issues

##What's new

####v1.3.0
Homey Client version 1.2 and above changed the way signals were received and this resulted in issues with the Brel remote.
This update fixes these issues and signals from the remote should now be able to be received correctly.
Also the option to reset the blinds from Homey is disabled, now you will only be able to pair your motors using your remote. 
This is because some build-in motors should not be reset and this caused usability problems for those users.

####v1.1.0
Added logging and error reporting

####v1.0.1
Increased amount of command repetitions from 5 to 20 to improve reception of the command

####v1.0.0
Initial app release. App is tested with the Brel MLE25-1.1. 

