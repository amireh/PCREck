/**
 * This file is part of PCREck.
 *
 * PCREck is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * PCREck is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with PCREck. If not, see <http://www.gnu.org/licenses/>.
 *
 * Authors:
 * Copyright (C) 2013 Ahmad Amireh <ahmad@algollabs.com>
 * Copyright (C) 2003-2011 Christopher M. Kohlhoff (chris at kohlhoff dot com)
 */

#include <iostream>
#include <fstream>
#include <string>
#include <boost/asio.hpp>
#include <boost/thread.hpp>
#include <boost/bind.hpp>

#include <pthread.h>
#include <signal.h>
#include <libxml/xmlmemory.h>

#include <algol/algol.hpp>
#include <algol/utility.hpp>
#include "kernel.hpp"

using algol::string_t;

int print_help()
{
  std::cout << "Usage: ./PCREck\n";
  std::cout << "To configure PCREck, see ../PCREck.cfg.in or visit https://github.com/amireh/PREck\n";
  return 1;
}

int main(int argc, char**)
{
  if (argc > 1)
    return print_help();

  // block all signals for background thread
  sigset_t new_mask;
  sigfillset(&new_mask);
  sigset_t old_mask;
  pthread_sigmask(SIG_BLOCK, &new_mask, &old_mask);

  xmlInitParser();

  algol::algol_init("PCREck", "0", "6", "0", "rc1");

  {
    pcreck::kernel kernel_;
    kernel_.init();

    // run kernel in background thread

    // attempt to configure from a JSON file
    /*std::ifstream cfg_stream(algol::path_t(algol::file_manager::singleton().bin_path() / "algold.cfg").make_preferred().string());
    if (cfg_stream.is_open() && cfg_stream.good()) {
      string_t json_cfg;
      cfg_stream.seekg(0, std::ios::end);
      json_cfg.reserve(cfg_stream.tellg());
      cfg_stream.seekg(0, std::ios::beg);

      json_cfg.assign((std::istreambuf_iterator<char>(cfg_stream)),
                       std::istreambuf_iterator<char>());

      algold->configure(json_cfg);
    } else {
      // otherwise set some defaults
      kernel::config_t config;
      config.port = "9090";
      config.listen_interface = "0.0.0.0";
      config.nr_workers = 4;
      algold->configure(config);
    }*/
    kernel_.configure("");

    boost::thread t(boost::bind(&pcreck::kernel::run, &kernel_));

    // restore previous signals
    pthread_sigmask(SIG_SETMASK, &old_mask, 0);

    // wait for signal indicating time to shut down
    sigset_t wait_mask;
    sigemptyset(&wait_mask);
    sigaddset(&wait_mask, SIGINT);
    sigaddset(&wait_mask, SIGQUIT);
    sigaddset(&wait_mask, SIGTERM);
    pthread_sigmask(SIG_BLOCK, &wait_mask, 0);
    int sig = 0;
    sigwait(&wait_mask, &sig);

    // stop the kernel
    if (kernel_.is_running())
      kernel_.stop();

    kernel_.cleanup();

    t.join();
  }

  algol::algol_cleanup();

  xmlCleanupParser();

  return 0;
}
