/*
 * Copyright (C) dakwak, Inc - All Rights Reserved
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Written by Ahmad Amireh <ahmad@dakwak.com>, December 2011
 */

#include "template_test/template_test.hpp"

namespace dakwak {
namespace api {

  template_test::template_test() : test("template") {
  }

  template_test::~template_test() {
  }

  int template_test::run(int, char**) {

    return result_;
  }


}
}
