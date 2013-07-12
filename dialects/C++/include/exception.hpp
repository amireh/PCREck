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

#ifndef H_RGX_EXCEPTION_H
#define H_RGX_EXCEPTION_H

#include <exception>
#include <string>
#include <stdexcept>

namespace rgx {

  /* bad conversion
   *
   * thrown when an argument passed to utility::convertTo<> is not a number
   * and thus can not be converted
   **/
	class invalid_request : public std::runtime_error {
	public:
		inline invalid_request(const std::string& s)
		: std::runtime_error(s)
		{ }
  };

} // end of namespace algol

#endif
