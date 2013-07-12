/**
 * This file is part of rgx.
 *
 * rgx is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * rgx is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with rgx. If not, see <http://www.gnu.org/licenses/>.
 */

package com.algollabs;

import java.io.PrintStream;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.util.Iterator;
import java.util.Collections;
import java.util.Map.Entry;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.simpleframework.http.Request;
import org.simpleframework.http.Response;
import org.simpleframework.http.Status;
import org.simpleframework.http.core.Container;
import org.simpleframework.http.core.ContainerServer;
import org.simpleframework.transport.Server;
import org.simpleframework.transport.connect.Connection;
import org.simpleframework.transport.connect.SocketConnection;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Parser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.OptionBuilder;
import org.apache.commons.cli.GnuParser;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.ParseException;
import org.apache.commons.cli.HelpFormatter;

public class rgx implements Container {

  /**
   * Indicates a request containing an unsupported attributes.
   *
   * @see App#handle for API request structure
   */
  public class UnrecognizedAttributeException extends Exception {
    public UnrecognizedAttributeException(String attribute) {
      super(String.format("Unrecognized attribute: '%s'", attribute));
    }
  };

  public void handle(Request request, Response response) {
    PrintStream body = null;
    Boolean     supported = false;

    try {
      body = response.getPrintStream();
    } catch (IOException e) {
      response.setStatus(Status.INTERNAL_SERVER_ERROR);
      try {
        response.close();
      } catch (IOException sube) {
        sube.printStackTrace();
        return;
      }
    }

    response.setValue("Content-Type", "application/json");

    // Route the request
    if (request.getMethod().equals("GET") && request.getTarget().contains("flags")) {
      supported = true;
      this.showSupportedFlags(request, response, body);
    }

    if (request.getMethod().equals("POST") && // A Construct hit?
        // We accept JSON only
        request.getContentType().toString().contains("application/json")) {

      supported = true;
      this.testExpression(request, response, body);
    }

    if (!supported) {
      response.setStatus(Status.NOT_IMPLEMENTED);
      try { response.close(); }
      catch (IOException e) { }
    };
  }

  private void showSupportedFlags(Request request, Response response, PrintStream stream) {
    stream.println(supported_flags_.serialize());
    stream.close();
  }

  /**
   * Handles an API Construct request.
   *
   * Request JSON structure:
   * {
   *   "pattern": "json_encoded_regex",
   *   "subject": "string",
   *   "flags": ""
   * }
   *
   */
  private void testExpression(Request request, Response response, PrintStream stream) {
    try {
      String ptrn     = null;
      String subj     = null;
      String flags    = null;

      // parse the required attributes: pattern, subject, and flags

      JsonElement jsonElement = parser_.parse(request.getContent());
      JsonObject  jsonObject  = jsonElement.getAsJsonObject();

      for (Entry<String, JsonElement> entry : jsonObject.entrySet()) {
        String      k = entry.getKey();
        JsonElement v = entry.getValue();

        if (k.equals("pattern"))      { ptrn  = gson_.fromJson(v, String.class); }
        else if (k.equals("subject")) { subj  = gson_.fromJson(v, String.class); }
        else if (k.equals("flags"))   { flags = gson_.fromJson(v, String.class); }
        else {
          throw new UnrecognizedAttributeException(k);
        }
      }

      // have a Construct test the expression
      stream.println((new Construct(ptrn, subj, flags, true)).test());
      response.setStatus(Status.OK);
    } catch (UnrecognizedAttributeException e) {
      e.printStackTrace();

      response.setStatus(Status.BAD_REQUEST);
      stream.println(e.getMessage());

    } catch(Exception e) {
      e.printStackTrace();

      response.setStatus(Status.INTERNAL_SERVER_ERROR);
      stream.println(e.getMessage());
    }

    stream.close();
  }

  public static void main(String[] args) throws Exception {
    CommandLine cli;

    // create the command line parser
    CommandLineParser parser = new GnuParser();

    // create the Options
    options.addOption( "h", "help", false, "print this help message" );
    options.addOption( "d", "daemonize", false, "run rgx:Java as a daemon" );
    options.addOption( OptionBuilder.withLongOpt( "pattern" )
                                    .withDescription( "Java regular expression raw pattern" )
                                    .hasArg()
                                    .withArgName("PATTERN")
                                    .create());

    options.addOption( OptionBuilder.withLongOpt( "subject" )
                                    .withDescription( "subject to test the pattern against" )
                                    .hasArg()
                                    .withArgName("SUBJECT")
                                    .create());

    options.addOption( OptionBuilder.withLongOpt( "interface" )
                                    .withDescription( "the interface to bind to when daemonized" )
                                    .hasArg()
                                    .withArgName("INTERFACE")
                                    .create());

    options.addOption( OptionBuilder.withLongOpt( "port" )
                                    .withDescription( "the port to bind to when daemonized" )
                                    .hasArg()
                                    .withArgName("PORT")
                                    .create());


    try {
      // parse the command line arguments
      cli = parser.parse( options, args );
    }
    catch( ParseException exp ) {
      System.out.println( "Unexpected exception:" + exp.getMessage() );
      return;
    }

    if (cli.hasOption("help")) {
      printHelp();
      return;
    }

    if (cli.hasOption( "daemonize" )) {
      String      port      = "9400";
      String      host      = "0.0.0.0";

      if (cli.hasOption("port")) {
        port = cli.getOptionValue( "port" );
      }
      if (cli.hasOption("interface")) {
        host = cli.getOptionValue( "interface" );
      }

      Container     container   = new rgx();
      Server        server      = new ContainerServer(container);
      Connection    connection  = new SocketConnection(server);
      SocketAddress address     = new InetSocketAddress(host, Integer.parseInt(port));

      connection.connect(address);

      System.out.println("Accepting requests on " + host + ":" + port);
    }
    else {
      String  ptrn  = null;
      String  subj  = null;
      String  flags = null;

      if (!cli.hasOption("pattern") || !cli.hasOption("subject")) {
        printHelp();
        return;
      }

      ptrn  = cli.getOptionValue( "pattern" );
      subj  = cli.getOptionValue( "subject" );

      if (cli.hasOption("flags"))
        flags = cli.getOptionValue( "flags" );

      System.out.println(new Construct(ptrn, subj, flags, false).test());
    }
  }

  private static void printHelp() {
    HelpFormatter formatter = new HelpFormatter();
    formatter.printHelp( "rgx", options );
  }

  private static final JsonParser parser_ = new JsonParser();
  private static final Gson       gson_   = new Gson();

  private static Options options = new Options();;

  /**
   * Expose supported Pattern compilation flags.
   */
  private static final Map<String, Integer> FLAGS;
  static {
    Map<String, Integer> flagsMap = new HashMap<String, Integer>();

    flagsMap.put("DOTALL",            Pattern.DOTALL);
    flagsMap.put("CASE_INSENSITIVE",  Pattern.CASE_INSENSITIVE);
    flagsMap.put("COMMENTS",          Pattern.COMMENTS);
    flagsMap.put("MULTILINE",         Pattern.MULTILINE);
    flagsMap.put("LITERAL",           Pattern.LITERAL);
    flagsMap.put("UNICODE_CASE",      Pattern.UNICODE_CASE);
    flagsMap.put("UNICODE_CHAR",      Pattern.UNICODE_CHARACTER_CLASS);
    flagsMap.put("UNIX_LINES",        Pattern.UNIX_LINES);
    flagsMap.put("CANON_EQ",          Pattern.CANON_EQ);

    FLAGS = Collections.unmodifiableMap(flagsMap);
  }

  /**
   * An implementation of the rgx Dialect Construct specification.
   *
   * Constructs take a regular expression pattern, compile it, test it against
   * a subject, and provide a JSON-encoded result.
   *
   * @see https://www.pagehub.org/amireh/rgx/spec
   */
  private static class Construct {

    public Construct(String in_ptrn, String in_subj, String in_flags) {
      raw_ptrn_ = in_ptrn;
      subj_     = in_subj;
      flags_    = in_flags;
    }

    public Construct(String in_ptrn, String in_subj, String in_flags, Boolean unescape) {
      raw_ptrn_ = in_ptrn.replace("\\\\", "\\");
      subj_     = in_subj;
      flags_    = in_flags;
    }

    /**
     * Tests the supplied pattern against the supplied subject.
     *
     * @return JSON-encoded result
     * @see ConstructRC
     */
    public String test() {
      String out  = null;
      Matcher m   = null;

      if ((ptrn_ = compile()) == null) {
        return new ConstructBadPatternRC().serialize(this);
      }

      System.out.println("Testing " + ptrn_.pattern() + " on " + subj_);

      m = ptrn_
          .matcher(subj_)
          .useAnchoringBounds(false)
          .useTransparentBounds(false);

      if (m.find(0)) {
        int nr_groups = m.groupCount();

        offset_ = new int[]{ m.start(0), m.end(0) };

        // System.out.println("Match boundaries: " + offset_[0] + "," + offset_[1]);
        // System.out.println("# of captures: " + nr_groups);

        for (int i = 1; i <= nr_groups; ++i) {
          captures_.add(new Capture(m.start(i), m.group(i)));
          // System.out.println("Capture @" + m.start(i) + " => " + m.group(i) );
        }

        out = new ConstructMatchRC().serialize(this);
      } else {
        out = new ConstructNoMatchRC().serialize(this);
      }

      return out;
    }

    /**
     * Compiles the supplied pattern with the supplied compilation flags.
     *
     * @return null if the pattern compilation fails, see bad_ptrn_message_ for
     * the failure cause
     *
     * @see FLAGS
     */
    private Pattern compile() {
      try {
        int flags = 0;
        if (flags_ != null) {
          for (String flag_identifier : FLAGS.keySet()) {
            if (flags_.contains(flag_identifier)) {
              System.out.println("Using flag: " + flag_identifier);
              flags = flags | FLAGS.get(flag_identifier);
            }
          }
        }

        // System.out.println(String.format("Compiling %s", raw_ptrn_));

        return Pattern.compile(raw_ptrn_, flags);
      } catch (Exception e) {
        e.printStackTrace();

        System.out.println(String.format("Bad pattern '%s': %s", raw_ptrn_, e.getMessage()));
        bad_ptrn_message_ = e.getMessage();
      }

      return null;
    }

    /**
     * Represents a captured group in a Construct's pattern test.
     *
     * Capture instances point to the starting position of their match, and
     * the content of the match. The length of the capture can be denoted
     * by those two variables and therefore is not included.
     */
    private class Capture {
      Capture(int in_position, String in_string) {
        string    = in_string;
        position  = in_position;
      }

      private int position;
      private String string;
    };

    /**
     * An interface for serializing Constructs into JSON based on Construct#test
     * output.
     */
    public interface ConstructRC {
      /**
       * Return a JSON-encoded rgx Dialect Construct response.
       */
      public abstract String serialize(Construct c);
    };

    /**
     * A matching construct test.
     *
     * JSON structure:
     * {
     *   "status": "RC_MATCH",
     *   "offset": [ MATCH_BEGIN, MATCH_END ],
     *   "captures": [{
     *     "position": CAPTURE_OFFSET_BEGIN,
     *     "string":   "CAPTURED_STRING"
     *   }]
     * }
     *
     * The "captures" key will be an empty array in case the pattern has
     * no group captures.
     */
    private class ConstructMatchRC implements ConstructRC {
      public String serialize(Construct c) {
        offset    = c.offset_;
        captures  = c.captures_;

        return gson_.toJson(this);
      }

      private final String status = RC_MATCH;
      private int[] offset;
      private
       ArrayList<Capture> captures;
    };

    /**
     * Pattern does not match the supplied subject.
     *
     * JSON structure:
     * {
     *   "status": "RC_NOMATCH"
     * }
     */
    private class ConstructNoMatchRC implements ConstructRC {
      public String serialize(Construct c) {
        return gson_.toJson(this);
      }

      private final String status = RC_NOMATCH;
    };

    /**
     * A bad supplied pattern.
     *
     * JSON structure:
     * {
     *   "status": "RC_BADPATTERN",
     *   "error": "MESSAGE"
     * }
     */
    public static class ConstructBadPatternRC implements ConstructRC {
      public String serialize(Construct c) {
        error = c.bad_ptrn_message_;
        return gson_.toJson(this);
      }

      private final String status = RC_BADPATTERN;
      private String error;
    };

    public int[]              offset_ = new int[]{};
    public ArrayList<Capture> captures_ = new ArrayList<Capture>();

    /** Will contain the pattern compilation failure message if one occurs */
    public String bad_ptrn_message_;

    private static final String RC_MATCH       = "RC_MATCH";
    private static final String RC_NOMATCH     = "RC_NOMATCH";
    private static final String RC_BADPATTERN  = "RC_BADPATTERN";

    private Pattern ptrn_;
    private String  raw_ptrn_;
    private String  subj_;
    private String  flags_;
  }; /** class Construct */

  private class SupportedFlags {
    SupportedFlags() {
      flags.put("CASE_INSENSITIVE", "Enables case-insensitive matching.");
      flags.put("DOTALL",           "Enables dotall mode.");
      flags.put("COMMENTS",         "Permits whitespace and comments in pattern.");
      flags.put("MULTILINE",        "Enables multiline mode.");
      flags.put("LITERAL",          "Enables literal parsing of the pattern.");
      flags.put("UNICODE_CASE",     "Enables Unicode-aware case folding.");
      flags.put("UNICODE_CHAR",     "Enables the Unicode version of Predefined character classes and POSIX character classes.");
      flags.put("UNIX_LINES",       "Enables Unix lines mode.");
      flags.put("CANON_EQ",         "Enables canonical equivalence.");
    }

    public String serialize() {
      return gson_.toJson(this);
    }

    private Map<String, String> flags = new HashMap<String, String>();
  }

  private final SupportedFlags supported_flags_ = new SupportedFlags();
}