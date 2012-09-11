module PCREck
  class JavaScript < Engine
    def query(pattern, subject, options = "", encode = true)
      res = nil
      IO.popen(["PCREck.js", 
                "#{pattern.to_json}", 
                "#{subject.to_json}",
                "#{options.to_json}", 
                :err=>[:child, :out]]) {|io|
        res = io.read
        # puts "---- PCREck.js output:"
        # puts res
        # puts "---- END OF PCREck.js OUTPUT"
        res = res.split("\n").last.strip
      }

      report res, encode
    end
  end

  JavaScript.new
end