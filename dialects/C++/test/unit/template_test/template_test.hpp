/*
 * Copyright (C) dakwak, Inc - All Rights Reserved
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Written by Ahmad Amireh <ahmad@dakwak.com>, December 2011
 */

#ifndef H_DAKAPI_template_test_H
#define H_DAKAPI_template_test_H

#include "test.hpp"
#include "dakwak.hpp"

namespace dakwak {
namespace api {

	class template_test : public test {
	public:
		template_test();
		virtual ~template_test();

    int run(int argc, char** argv);

	protected:

	};

}
}
#endif
