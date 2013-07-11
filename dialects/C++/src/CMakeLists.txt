# add sources
SET(Project_SRCS
  main.cpp
  kernel.cpp
  connection.cpp
  request_parser.cpp
  request_handler.cpp
)

# the executable
ADD_EXECUTABLE(${PROJECT_NAME} ${Project_SRCS})
