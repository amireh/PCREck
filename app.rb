gem 'sinatra'

require 'rubygems'
require 'sinatra'
require 'json'
require 'shellwords'

get '/' do
  erb :index
end

post '/' do
  content_type :json

  ptrn = params[:pattern]
  text = params[:text]

  halt 401 if !ptrn || !text

  # ret = %x{PCREck.lua \
  #   --compact \
  #   --pattern=#{Shellwords.escape(ptrn.to_json)} \
  #   --subject=#{Shellwords.escape(text.to_json)}}

  ret = nil
  IO.popen(["PCREck.lua", 
            "--pattern=#{ptrn.to_json}", 
            "--subject=#{text.to_json}", 
            "--compact", :err=>[:child, :out]]) {|io|
    ret = io.read
    # puts ret
    ret = ret.split("\n").last
  }


  halt 500 if ret.strip.empty?

  ret = JSON.parse(ret)

  if ret.class != Array && ret.has_key?("error")
    return [ false, ret["error"] ].to_json
  end

  # puts ret.inspect

  return 200, ret.to_json
end

helpers do

  # ProximaNova, the font I use, is not compatible with an open-source
  # license and so I've excluded it from the public repository and include
  # it only when running the main site www.pcreck.com
  #
  # The CSS falls back to Arial in the case this one isn't available
  def has_proximanova?
    File.exists?(File.join(settings.root, "public", "css", "fonts", "proximanova.css"))
  end

end