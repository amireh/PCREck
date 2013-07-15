$LOAD_PATH << File.dirname(__FILE__)

$ROOT ||= File.join( File.dirname(__FILE__), '..' )
$LOAD_PATH << $ROOT

require 'rubygems'
require 'bundler/setup'
require 'base64'
require 'net/http'

Bundler.require(:default)

configure do
  require 'lib/version'

  puts "---- rgx #{Rgx::VERSION} ----"
  puts ">> Booting..."

  # --------------------------------------------------------
  # Validate that configuration files exist and are readable
  config_files = [ 'database', 'dialects' ]
  config_files.each { |config_file|
    unless File.exists?(File.join($ROOT, 'config', "%s.yml" %[config_file] ))
      raise "Missing required config file: config/%s.yml" %[config_file]
    end
  }
  config_files.each { |cf| config_file './%s.yml' %[cf] }
  # --------------------------------------------------------

  set :root, $ROOT
  set :server, :thin

  # @@engines = {}
  # @@dialects = []

  @@dialects = settings.dialects.keys

  def log(msg)
    if settings.development? then
      puts "[D] #{msg}"
    end
  end

  # def register_engine(e)
  #   @@engines[e.dialect] = e
  #   @@dialects << e.dialect
  # end

  # log "Loading engines"
  # require 'lib/engine'
  # Dir.glob("#{$ROOT}/lib/**/*.rb").each { |e| require e }

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

  require 'config/initializers/datamapper'
end

helpers do

  # ProximaNova, the font I use, is not compatible with an open-source
  # license and so I've excluded it from the public repository and include
  # it only when running the main site www.rgx.com
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

get '/dialects' do
  settings.dialects.keys.to_json
end

get '/status', provides: [ :json ] do
  status = {}

  @@dialects.each do |dialect|
    status[dialect] = false

    endpoint = URI.parse(settings.dialects[dialect])
    req = Net::HTTP.new(endpoint.host, endpoint.port)
    req.open_timeout = 0.25
    req.read_timeout = 1

    begin
      req.get(endpoint.request_uri || '/')
      status[dialect] = true
    rescue Exception => e
    end
  end

  respond_with status do |f|
    f.json { status.to_json }
  end
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

get '/:dialect/cheatsheet' do |dialect|
  @fullview = true
  erb :"cheatsheets/#{dialect}", layout: :"minimal_layout"
end

# Backwards-compatibility
get '/'               do show_dialect("PCRE", "simple") end
get '/modes/simple'   do redirect '/' end
get '/modes/advanced' do show_dialect("PCRE", "advanced") end

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

get '/dialects' do
  erb :"/dialects", layout: :"minimal_layout"
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