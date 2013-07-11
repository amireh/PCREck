#~ CMAKE_MINIMUM_REQUIRED(VERSION 2.8)
#~
#~ IF(DEFINED CMAKE_BUILD_TYPE)
  #~ SET(CMAKE_BUILD_TYPE ${CMAKE_BUILD_TYPE} CACHE STRING "Choose the type of build, options are: None(CMAKE_CXX_FLAGS or CMAKE_C_FLAGS used) Debug Release RelWithDebInfo MinSizeRel.")
#~ ELSE()
  #~ SET(CMAKE_BUILD_TYPE Debug CACHE STRING "Choose the type of build, options are: None(CMAKE_CXX_FLAGS or CMAKE_C_FLAGS used) Debug Release RelWithDebInfo MinSizeRel.")
#~ ENDIF()
#~
#~ INCLUDE (CheckIncludeFileCXX)
#~ INCLUDE (CMakeDependentOption)
#~
#~ PROJECT(Phantom_Tests)
#~
#~ SET( CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} ${CMAKE_CURRENT_SOURCE_DIR}/../../CMake ${CMAKE_CURRENT_SOURCE_DIR}/../../CMake/Packages )
#~
#~ FIND_PACKAGE(PkgConfig)
#~ FIND_PACKAGE(log4cpp REQUIRED)
#~ FIND_PACKAGE(PostgreSQL REQUIRED)
#~ FIND_PACKAGE(Lua51 REQUIRED)
#~ FIND_PACKAGE(EShared REQUIRED)
#~ FIND_PACKAGE(Boost 1.46 COMPONENTS thread date_time filesystem REQUIRED)
#~
#~ INCLUDE_DIRECTORIES(
  #~ ${CMAKE_CURRENT_SOURCE_DIR}
  #~ ${CMAKE_CURRENT_SOURCE_DIR}/../../include
  #~ ${Boost_INCLUDE_DIRS}
  #~ ${LOG4CPP_INCLUDE_DIR}
  #~ ${LUA_INCLUDE_DIR}
  #~ ${PostgreSQL_INCLUDE_DIRS}
  #~ ${ESHARED_INCLUDE_DIRS})
#~
#~ LINK_LIBRARIES(
  #~ ${Boost_LIBRARIES}
  #~ ${LOG4CPP_LIBRARIES}
  #~ ${LUA_LIBRARIES}
  #~ pqxx
  #~ ${ESHARED_LIBRARIES}
  #~ tolua++)
#~
#~ ADD_DEFINITIONS("-std=c++0x")
SET(EXECUTABLE_OUTPUT_PATH ${CMAKE_CURRENT_SOURCE_DIR}/bin)
#~
#~ SET(Server_SRCS
#~
  #~ ${CMAKE_CURRENT_SOURCE_DIR}/../../src/Entity.cpp
#~ )

INCLUDE_DIRECTORIES(.)

# ---
# (de)serializing terms test
# ---
SET(TEST serializing_terms_test)
SET(TEST_SRCS
  ${CMAKE_CURRENT_SOURCE_DIR}/${TEST}/${TEST}.hpp
  ${CMAKE_CURRENT_SOURCE_DIR}/${TEST}/${TEST}.cpp
  ${Server_SRCS}
  ${CMAKE_CURRENT_SOURCE_DIR}/../../src/term.cpp
)

CONFIGURE_FILE(${CMAKE_CURRENT_SOURCE_DIR}/main.cpp.in ${CMAKE_CURRENT_SOURCE_DIR}/${TEST}/main.cpp)
LIST(APPEND TEST_SRCS ${CMAKE_CURRENT_SOURCE_DIR}/${TEST}/main.cpp)
ADD_EXECUTABLE(${TEST} ${TEST_SRCS})
