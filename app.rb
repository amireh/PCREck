gem 'sinatra'
gem 'sinatra-content-for'
gem "dm-core", ">=1.2.0"
gem "dm-migrations", ">=1.2.0"
gem "dm-mysql-adapter", ">=1.2.0"

require 'rubygems'
require 'sinatra'
require 'sinatra/content_for'
require 'json'
require 'base64'
require 'dm-core'
require 'dm-migrations'
require 'dm-mysql-adapter'

configure do

  def log(msg)
    if settings.development? then
      puts "[D] #{msg}"
    end
  end

  class PCREck

    # Executes PCREck.lua with the given pattern and subject and
    # returns the last line of the output
    def self.query(pattern, subject)
      res = nil
      IO.popen(["PCREck.lua", 
                "--pattern=#{pattern.to_json}", 
                "--subject=#{subject.to_json}",
                "--decode", 
                "--compact", :err=>[:child, :out]]) {|io|
        res = io.read
        # log "---- PCREck's output:"
        # log res
        # log "---- END OF PCRECK'S OUTPUT"
        res = res.split("\n").last.strip
      }
      res
    end

    # Decodes the output received from PCREck.query. If @dont_encode
    # is set to true, the returned result will _not_ be JSON encoded.
    def self.reportable_result(pcreck_res, dont_encode = false)
      json_result = JSON.parse(pcreck_res)

      if json_result.class != Array && json_result.has_key?("error")
        json_result = [ false, json_result["error"] ]
      end

      log json_result.inspect

      dont_encode ? json_result : json_result.to_json
    end

  end

  class Permalink
    include DataMapper::Resource

    property :id, String, 
      key: true, 
      unique: true, 
      length: 24, 
      default: lambda { |*_| Permalink.gen_token }
    property :pattern, Text, default: ""
    property :subject, Text, default: ""
    property :options, String, default: ""
    property :mode, String, default: "simple"
    property :created_at, DateTime, default: lambda { |*_| DateTime.now }

    def self.gen_token
      Base64.urlsafe_encode64 rand(36**16).to_s(36)
    end
  end

  log "connecting to the MySQL backend"

  # DataMapper::Logger.new($stdout, :debug)
  DataMapper.setup(:default, 'mysql://root@localhost/PCREck')
  DataMapper.finalize
  DataMapper.auto_upgrade!
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

  # A convenience method for printing a checkbox for a PCRE option which
  # is identified by a single letter
  def pattern_option(key)
    "<input tabindex=\"-1\" type=\"checkbox\" name=\"pcre[options]\" \
            value=\"#{key}\" #{"checked=\"checked\"" if @link.options.include?(key)} />"
  end

end

get '/modes/simple' do
  redirect '/'
end

get '/modes/advanced' do
  log params.inspect
  # Accept initial values from the URL parameters, if any
  @link = Permalink.new({
    pattern: params[:p] || "",
    subject: { 0 => (params[:s] || "") }.to_json,
    options: params[:o] || "",
    mode: "advanced"
  })

  log @link.inspect

  erb :"modes/advanced"
end

get '/' do
  # log params.inspect

  # Accept initial values from the URL parameters, if any:
  # => p for pattern
  # => s for subject
  # => o for options
  @link = Permalink.new({
    pattern: params[:p] || "",
    subject: params[:s] || "",
    options: params[:o] || ""
  })

  erb :"modes/simple"
end

get '/cheatsheets/PCRE' do
  erb :"cheatsheets/PCRE", layout: :"minimal_layout"
end

# Permanent entry links handler
get '/:token' do |token|
  return if token == "favicon.ico" # ...

  @link = Permalink.get(token) || Permalink.new

  erb :"modes/#{@link.mode}"
end

post '/' do
  ptrn = params[:pattern]
  text = params[:text]

  halt 400 if !ptrn || !text

  return 200, PCREck.reportable_result(PCREck.query(ptrn, text))
end

post '/modes/advanced' do
  log params.inspect

  halt 400 if !params[:pattern] || !params[:subjects] || params[:subjects].empty?

  # The returned result looks something like this:
  # { 0: []|{}, ..., n: []|{} } where n is the number of subjects
  collective_result = {}
  params[:subjects].each_pair { |idx, subject|
    res = PCREck.query(params[:pattern], subject)
    collective_result[idx] = PCREck.reportable_result(res, true)
  }

  collective_result.to_json
end

post '/permalink' do
  log params.inspect

  halt 400 if !params[:pattern] || (!params[:subject] && !params[:subjects])

  subject = params[:subject]

  # serialize and store multiple subjects as JSON when using the advanced mode
  if params[:mode] == "advanced" then
    subject = params[:subjects].to_json
  end

  halt 400 if params[:pattern].empty?

  link = Permalink.create({
    pattern: params[:pattern],
    subject: subject,
    options: params[:options],
    mode: params[:mode]
  })

  port = request.port != 80 ? ":#{request.port}" : ""
  return 200, "http://#{request.host}#{port}/#{link.id}"
end