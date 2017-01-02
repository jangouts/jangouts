#!/bin/bash

sudo zypper -n ar -f --no-gpgcheck http://download.opensuse.org/repositories/editors/openSUSE_Leap_42.1/ editors
sudo zypper -n in emacs adobe-sourcecodepro-fonts zsh

sudo chsh -s /usr/bin/zsh vagrant

# set up direnv
#echo "eval \"\$(direnv hook zsh)\"" >> ~/.zshrc

test -d ~/.emacs.d || git clone https://github.com/syl20bnr/spacemacs ~/.emacs.d
rm -f .emacs
