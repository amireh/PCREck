module rgx
  class PCRE < Engine
    def script
      'rgx.lua'
    end

    # Executes rgx.lua with the given pattern and subject and
    # returns the last line of the output
    def query(in_pattern, subject, options = "", encode = true)
      pattern = "(?#{options})#{in_pattern}"

      res = nil
      IO.popen(["rgx.lua",
                "--pattern=#{pattern.to_json}",
                "--subject=#{subject.to_json}",
                "--decode",
                "--compact", :err=>[:child, :out]]) {|io|
        res = io.read
        # puts "---- rgx's output:"
        # puts res
        # puts "---- END OF PCRECK'S OUTPUT"
        res = res.split("\n").last.strip
      }

      report res, encode
    end
  end

  PCRE.new
end
