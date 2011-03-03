require "sinatra"

set :root, File.dirname(__FILE__)
set :haml, :format => :html5

get "/" do
  haml :index
end
