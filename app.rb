gem 'sinatra'
gem "data_mapper", ">=1.2.0"

require 'rubygems'
require 'sinatra'
require 'json'
require 'base64'
require 'data_mapper'
require 'dm-mysql-adapter'

class Permalink
  include DataMapper::Resource

  property :id, String, 
    key: true, 
    unique: true, 
    length: 24, 
    default: lambda { |_,__| Base64.urlsafe_encode64 rand(36**16).to_s(36) }
  property :pattern, Text, default: ""
  property :subject, Text, default: ""
  property :options, String, default: ""
  property :created_at, DateTime, default: lambda { |_,__| DateTime.now }
end

configure do
  puts "connecting to the MySQL backend"
  DataMapper::Logger.new($stdout, :debug)
  DataMapper.setup(:default, 'mysql://root@localhost/PCREck')
  DataMapper.finalize
  DataMapper.auto_upgrade!
end

helpers do
  # for permalinks
  # def deflate(string, level)
  #   Base64.urlsafe_encode64 string
  # end

  # def inflate(string)
  #   Base64.urlsafe_decode64 string
  # end
end

get '/mode/advanced' do
  # Accept initial values from the URL parameters, if any
  @link = Permalink.new({
    pattern: params[:p] || "",
    subject: params[:s] || "",
    options: params[:o] || ""
  })

  erb :"modes/advanced"
end

# Permanent entry links handler
get '/:token' do |token|
  return if token == "favicon.ico" # ...

  @link = Permalink.get(token) || Permalink.new

  erb :index
end

get '/' do
  puts params.inspect

  # Accept initial values from the URL parameters, if any
  @link = Permalink.new({
    pattern: params[:p] || "",
    subject: params[:s] || "",
    options: params[:o] || ""
  })

  return erb :index
end


def query(pattern, subject)
  res = nil
  IO.popen(["PCREck.lua", 
            "--pattern=#{pattern.to_json}", 
            "--subject=#{subject.to_json}", 
            "--compact", :err=>[:child, :out]]) {|io|
    res = io.read
    puts res
    res = res.split("\n").last.strip
  }
  res
end
def reportable_result(pcreck_res, dont_encode = false)
  json_result = JSON.parse(pcreck_res)

  if json_result.class != Array && json_result.has_key?("error")
    return [ false, json_result["error"] ].to_json
  end

  # puts json_result.inspect

  dont_encode ? json_result : json_result.to_json
end

post '/' do
  content_type :json

  ptrn = params[:pattern]
  text = params[:text]

  halt 400 if !ptrn || !text

  res = query(ptrn, text)

  # halt 500 if res.empty?

  return 200, reportable_result(res)
end

post '/mode/advanced' do
  puts params.inspect
  halt 400 if !params[:pattern] || !params[:subjects] || params[:subjects].empty?

  collective_result = {}
  params[:subjects].each_pair { |idx, subject|
    res = query(params[:pattern], subject)
    collective_result[idx] = reportable_result(res, true)
  }

  collective_result.to_json
end

post '/permalink' do
  halt 400 if !params[:pattern] || !params[:subject]
  halt 400 if params[:pattern].empty? && params[:subject].empty?

  link = Permalink.create({
    pattern: params[:pattern],
    subject: params[:subject],
    options: params[:options]
  })

  port = request.port != 80 ? ":#{request.port}" : ""
  return 200, "http://#{request.host}#{port}/#{link.id}"
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