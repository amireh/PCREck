$LOAD_PATH << File.dirname(__FILE__)

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

  @@engines = {}

  def log(msg)
    if settings.development? then
      puts "[D] #{msg}"
    end
  end

  def register_engine(e)
    @@engines[e.dialect] = e
  end

  log "Loading engines"
  require 'lib/engine'
  Dir.glob("lib/**/*.rb").each { |e| require e }

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
    property :dialect, String, default: "PCRE"
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

  def dialects
    out = []
    @@engines.each_pair { |d,_| out << d }
    out
  end
end

def show_dialect(dialect, mode)
  @dialect = dialect
  @mode    = mode

  if mode == "advanced"
    params[:s] = { 0 => (params[:s] || "") }.to_json
  end

  # Accept initial values from the URL parameters, if any:
  # => p for pattern
  # => s for subject
  # => o for options
  # => d for dialect
  @link ||= Permalink.new({
    pattern: params[:p] || "",
    subject: params[:s] || "",
    options: params[:o] || "",
    dialect: dialect,
    mode:    mode
  })

  erb :"modes/#{mode}"
end

[ '/:dialect', '/:dialect/advanced' ].each { |r|
  get r do |dialect|
    mode = request.path.include?("advanced") ? "advanced" : "simple"
    @@engines.each_pair { |d, _|
      if d == dialect then
        return show_dialect(d, mode)
      end
    }

    pass
  end
}

get '/:dialect/cheetsheet' do |dialect|
  @fullview = true
  erb :"cheatsheets/#{dialect}", layout: :"minimal_layout"
end

get '/modes/simple' do
  redirect '/'
end

get '/modes/advanced' do
  show_dialect("PCRE", "advanced")
  # log params.inspect
  # # Accept initial values from the URL parameters, if any
  # @link = Permalink.new({
  #   pattern: params[:p] || "",
  #   subject: { 0 => (params[:s] || "") }.to_json,
  #   options: params[:o] || "",
  #   dialect: params[:e] || "PCRE",
  #   mode: "advanced"
  # })

  # log @link.inspect

  # erb :"modes/advanced"
end

get '/' do
  # Backwards-compatibility
  show_dialect("PCRE", "simple")
end

def query_simple(dialect)
  p = params[:pattern]
  s = params[:subject]
  o = params[:options] || ""
  e = @@engines[dialect]

  halt 400, "Missing pattern" unless p
  halt 400, "Missing subject" unless s
  halt 400, "#{dialect} is not supported." if !e

  puts "Simple query using engine #{dialect}"

  return 200, e.query(p,s,o)
end

def query_advanced(dialect)
  log params.inspect
  p = params[:pattern]
  s = params[:subjects]
  o = params[:options] || ""
  e = @@engines[dialect]

  halt 400, "Missing pattern" if !p
  halt 400, "Missing subject(s)" if !s || s.empty?
  halt 400, "#{dialect} is not supported." if !e

  puts "Advanced query using engine #{dialect}"

  # The returned result looks something like this:
  # { 0: []|{}, ..., n: []|{} } where n is the number of subjects
  resultset = {}
  s.each_with_index { |subject, idx|
    resultset[idx] = e.query(p, subject, o, false)
  }

  resultset.to_json
end

post '/:dialect' do |dialect|
  query_simple(dialect)
end

post '/:dialect/advanced' do |dialect|
  query_advanced(dialect)
end

# Permalink capturer
get '/:token' do |token|
  return if token == "favicon.ico" # ...

  @link = Permalink.get(token) || Permalink.new
  show_dialect(@link.dialect, @link.mode)
  # erb :"modes/#{@link.mode}"
end

post '/:dialect/permalink' do |dialect|
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
    dialect: dialect,
    mode: params[:mode]
  })

  port = request.port != 80 ? ":#{request.port}" : "" # WTF?
  return 200, "http://#{request.host}#{port}/#{link.id}" # TODO: refactor
end