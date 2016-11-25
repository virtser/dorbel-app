#!/bin/bash
# First time install script to install all project dependenices.
# This script is optimized for Mac machines.

echo "Starting to install the apps..."

# Install Xcode
xcode-select --install

# Install Homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# Install node
brew install node

# Install git
brew install git

# Install AWS CLI
brew install awscli
brew install awsebcli

# Install Docker
brew cask install docker

# Install Flow support
brew install flow

# Install software
brew tap caskroom/cask
brew cask install google-chrome
brew cask install iterm2
brew cask install visual-studio-code
brew cask install gitkraken
brew cask install meld
brew cask install sequel-pro
brew cask install skitch
brew cask install spectacle
brew cask install slack

echo "All of the apps were installed succesfully!"
