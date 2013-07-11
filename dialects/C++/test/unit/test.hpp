/*
 * Copyright (C) dakwak, Inc - All Rights Reserved
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Written by Ahmad Amireh <ahmad@dakwak.com>, December 2011
 */

#ifndef H_DAKAPI_TEST_H
#define H_DAKAPI_TEST_H

#include <string>
#include <iostream>
#include <boost/asio.hpp>

namespace dakwak {
namespace api {

  class test {
    public:

    enum {
      success,
      failure
    };

    explicit test(std::string in_name)
    : io_service_(),
      name_(in_name),
      result_(failure)
    {
      std::cout << "-+-+ test: " << name_ << " starting +-+-\n";
      io_service_.run();
    }
    test(const test&) = delete;
    test& operator=(const test&) = delete;
    virtual ~test()
    {
      stop();
      std::cout << "-+-+ test: " << name_ << " finished: " << (result_ == success ? "success" : "failure") << " +-+-\n";
    }

    virtual int run(int argc, char** argv)=0;
    virtual void stop()
    {
      if (!io_service_.stopped()) {
        std::cout << "-+-+ test: " << name_ << " shutting down...\n";
        io_service_.stop();
      }
    }

    boost::asio::io_service const& get_io_service() const
    {
      return io_service_;
    }

    protected:

    boost::asio::io_service io_service_;

    std::string name_;
    int result_;

    private:

  };
}
}
#endif
