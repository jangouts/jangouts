# Wireframe Design Explanations for Draft 2

**Firstly**, I have distinguished 8 Jangouts interface groups:   
(based on how they should be logically organized)

1. ***my thumbnail*** (the video thumbnail showing myself)
2. ***others' thumbnails*** (the list of thumbnails of other participants)
3. ***chat***
4. ***my features*** (my audio on/off, my video on/off, window/screen share, hotkey)
5. ***general features*** (info, logout, layout change, toggle video/image)
6. ***"all" features*** (ignore/audio/video on/off for all)
7. ***main speaker video***
8. ***logo & username***

**Secondly**, I have recognized 3 layout types and matched the Personas & interface groups that are important for a certain layout and, thus, user type:  
(groups 5–8 are equally important for everyone)

1. ***manager*** (Joffrey + Jim)
    - generally, wants to be fully aware of everything that happens in the meeting & rarely uses any options for their own video
    - group 2 – wants to see and listen to everyone throughout the whole meeting & monitor attendance
    - group 3 – wants to see chat to make sure they don't miss anything
2. ***speaker*** (Sheldon & sometimes Joffrey + Jim + David)
    - group 1 – wants to make sure that everyone can see them & what they are presenting
    - group 3 – wants easy access to options to adjust them quickly as they are speaking & wants to use window/screen sharing options for presentations
3. ***listener*** (Cartman & sometimes David)
    - generally, wants to see the highlights of the meeting & doesn't care much about the details
    - group 2 – wants to have a glimpse at some people sometimes, doesn't care if the chat covers some thumbnails
    - group 3 – prefers to communicate through chat

**Thirdly**, I have outlined a few design decisions based on the survey & Cynthia's comments, but they can be changed and discussed further:

1. ***individual features for each video thumbnail*** – will use a pop-up menu for each thumbnail instead of placing 5 icons at the bottom of each thumbnail at all times, because when the screen is too small, it's going to be hard to click on those tiny icons & we don't want to see an ocean of icons instead of people's faces. On the other hand, we are compromising 1 click for 3 clicks. Also, for these, instead of having an icon (e.g. three dots) for the pop-up menu, we can let the user click anywhere on the thumbnail of a certain participant and the options will appear, which would work well for both bigger & smaller screens. Moreover, the menu would include: ignore, local mute, global mute, video on/off, pin.
2. ***general features*** – no pop-up menu and all features will be available in some toolbar within 1 click.
3. ***personal features*** – either implemented in a pop-up menu in my own thumbnail like #1 or available in a toolbar within 1-click reach like #2. This will depend on the layout mode.
4. ***window resize*** – window resize removed and replaced with a layout change option that only allows to toggle between 3 modes: manager, speaker, listener. Possibly, each mode would have its own theme except for the distinctive layout.
5. ***mute problem*** – *my own video mute* will be in the toolbar with my features (group 4), *local mute* (the one that doesn't notify that participant the they were muted) & *global mute* (notifies that participant that they were muted) will be in the pop-up menu in each individual thumbnail, *mute all* will be in the toolbar with "all" features (group 6).
6. ***pin problem*** – *layout change* will have a different icon and will be placed in the general features (group 5)  and *thumbnail pin* will be in the pop-up menu when clicked on each thumbnail
7. ***info*** – except for shortcuts, include a "how to" instructions as well.
8. *** logout*** – make less prominent, but make it available within 1 click.
9. ***footer*** – will include Jangouts version, "openSUSE" & link to GitHub.
10. ***notifications in chat*** – change to “You are no~~t~~ longer…” & “You are now ignoring ABC ~~now~~”
11. ***icons*** – icons will be supplemented with text, i.e. pin icon will also have text "pin" underneath.
