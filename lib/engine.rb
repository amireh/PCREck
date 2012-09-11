module PCREck
  class Engine
    attr_reader :dialect
    attr_reader :options # the options the engine supports

    def initialize()
      @dialect = self.class.name.split('::').last

      puts "Engine: #{@dialect}"

      register_engine self

      super()
    end

    def setup
      true
    end

    def query(pattern, subject, extra = nil, encode = true)
    end

    protected

    # Decodes the output received from Engine.query. If encode
    # is true, the returned result will be JSON encoded.
    def report(in_result, encode = true)
      r = nil

      begin
        r = JSON.parse(in_result)

        if !r.is_a?(Array) && r.has_key?("error")
          r = { error: r["error"] }
        end
      rescue JSON::ParserError => e
        r = { error: e.message }
      end


      encode ? r.to_json : r
    end    

  end
end