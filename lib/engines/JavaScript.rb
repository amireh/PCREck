module rgx
  class JavaScript < Engine
    def script
      'rgx.js'
    end

    def query(pattern, subject, options = "", encode = true)
      res = nil
      IO.popen(["rgx.js",
                "#{pattern.to_json}",
                "#{subject.to_json}",
                "#{options.to_json}",
                :err=>[:child, :out]]) {|io|
        res = io.read
        # puts "---- rgx.js output:"
        # puts res
        # puts "---- END OF rgx.js OUTPUT"
        res = res.split("\n").last.strip
      }

      report res, encode
    end
  end

  JavaScript.new
end