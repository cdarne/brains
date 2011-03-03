require 'bundler'
Bundler.require

$LOAD_PATH.unshift(File.dirname(__FILE__))

require 'brains'

run Sinatra::Application
