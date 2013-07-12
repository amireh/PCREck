require 'rubygems'
require 'bundler/setup'

Bundler.require(:default)

RC_MATCH = 'RC_MATCH'
RC_NOMATCH = 'RC_NOMATCH'
RC_BADPATTERN = 'RC_BADPATTERN'

configure do
  set :protection, :except => [ :http_origin ]
end

before do
  if (request.accept || '').to_s.include?('json')
    request.body.rewind
    body = request.body.read.to_s || ''
    unless body.empty?
      begin;
        params.merge!(::JSON.parse(body))
        # puts params.inspect
        # puts request.path
      rescue ::JSON::ParserError => e
        puts e.message
        puts e.backtrace
        halt 400, "Malformed JSON content"
      end
    end
  end
end

Flags = {
  'i' => 'Ignore case',
  'm' => 'Treat a newline as a character matched by .',
  'x' => 'Ignore whitespace and comments in the pattern'
}

get '/flags', provides: [ :json ] do
  Flags.to_json
end

post '/', provides: [ :json ] do
  ptrn = params[:pattern]
  subj = params[:subject]
  flags = params[:flags]
  rc, re = nil, nil

  puts params.inspect

  if !ptrn || !subj then
    halt 400, "Missing pattern "
  end

  if flags && !flags.empty?
    ptrn = "(?#{flags}:#{ptrn})"
  end

  begin re = Regexp.compile(ptrn)
  rescue Exception => e
    return {
      status: RC_BADPATTERN,
      error: e.message
    }.to_json
  end

  if match = re.match(subj)
    rc = {
      status: RC_MATCH,
      offset: [ match.begin(0), match.end(0) ],
      captures: []
    }

    for i in (1..match.length-1) do
      rc[:captures] << {
        position: match.begin(i),
        string:   match[i]
      }
    end
  else
    rc = {
      status: RC_NOMATCH
    }
  end

  rc.to_json
end