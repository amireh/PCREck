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

#ifndef H_RGX_KERNEL_H
#define H_RGX_KERNEL_H

#include <string>
#include <vector>
#include <list>

// BOOST
#include <boost/asio.hpp>
#include <boost/bind.hpp>
#include <boost/shared_ptr.hpp>
#include <boost/thread.hpp>
#include <boost/interprocess/sync/interprocess_mutex.hpp>
#include <boost/interprocess/sync/scoped_lock.hpp>

#include <algol/configurable.hpp>
#include <algol/logger.hpp>
#include <algol/file_manager.hpp>
#include <algol/lua/engine.hpp>

#include "rgx.hpp"

using algol::string_t;
using algol::logger;
using algol::configurable;

namespace rgx {

  class connection;
  typedef boost::shared_ptr<connection> connection_ptr;
  typedef boost::interprocess::scoped_lock<boost::interprocess::interprocess_mutex> scoped_lock;

  class kernel : public configurable, public logger {
  public:
    typedef struct {
      string_t  listen_interface; /* default: 0.0.0.0 */
      string_t  port;             /* default: 8080 */
      size_t    nr_workers;       /* default: 1 */
    } config_t;

    explicit kernel();
    virtual ~kernel();
    kernel(const kernel&) = delete;
    kernel& operator=(const kernel&) = delete;

    void init();

    /**
     * Assigns Kernel configuration options directly.
     */
    void configure(const config_t&);

    /**
     * Configures dakwakd components using the given JSON string. If @json_config is empty,
     * dakwakd configuration will be read from bin/dakwakd.cfg.
     */
    void configure(const string_t& json_full_config);

    /** start the kernel */
    void run();

    typedef std::function<void()> pause_callback_t;
    /**
     * Turns on the pause state where the acceptor will still accept connections
     * but they will not be started until resume() is called.
     *
     * @arg callback
     *  Your handler that will be called when the Kernel is paused (all current
     *  connections are closed).
     *
     * @warn
     * The Kernel is not automatically resumed and must be manually resumed
     * by the registered pause callback, unless no callback is registered
     * then a resume is automatically fired.
     *
     * Pausing and Resuming are primarily used for reconfiguring dakwakd
     * without having to restart it or affect the availability of the service.
     */
    void pause(pause_callback_t);

    /**
     * Starts all paused connections (ones that were accepted while the Kernel was paused)
     * and toggles the paused status off.
     */
    void resume();

    /** stop the kernel */
    void stop();

    /** must be called after the kernel is stopped */
    void cleanup();

    bool is_running() const;
    bool is_paused() const;

    void set_option(string_t const& key, string_t const& value);

  protected:
    // marks the connection as dead and will be removed sometime later
    void close(connection_ptr);

  private:
    // a thread handling io_service::run()
    void work();

    void accept();
    void handle_accept(const boost::system::error_code &e);

    /**
     * Called back when all current connections are closed and a pause is pending.
     * Here is where the pause callback is fired.
     *
     * @warn
     * The Kernel is not automatically resumed and must be manually resumed
     * by the registered pause callback, unless no callback is registered
     * then a resume is automatically fired.
     */
    void on_paused();

    config_t config_;

    boost::asio::io_service io_service_;
    boost::asio::strand strand_;
    boost::thread_group workers_;
    boost::asio::ip::tcp::acceptor acceptor_;

    /// The next connection to be accepted.
    connection_ptr new_connection_;
    std::list<connection_ptr> connections_;
    std::list<connection_ptr> paused_connections_;
    boost::interprocess::interprocess_mutex conn_mtx_;

    bool running_; /** set to TRUE when the kernel is online and accepting connections */
    bool paused_; /** set to TRUE when pause() is called, and FALSE when resume() is */
    bool init_; /** set to TRUE when the kernel has allocated its resources properly */

    pause_callback_t pause_cb_;
    algol::lua::engine lua_engine_;
  };


} // namespace rgx

#endif // H_RGX_KERNEL_H
