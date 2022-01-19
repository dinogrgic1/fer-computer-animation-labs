cmake_minimum_required(VERSION 3.0)
project(raLab)

option(GLFW_BUILD_DOCS OFF)
option(GLFW_BUILD_EXAMPLES OFF)
option(GLFW_BUILD_TESTS OFF)
add_subdirectory(dependencies/glfw)

option(ASSIMP_BUILD_ASSIMP_TOOLS OFF)
option(ASSIMP_BUILD_SAMPLES OFF)
option(ASSIMP_BUILD_TESTS OFF)
add_subdirectory(dependencies/assimp)

add_subdirectory(primjerGLM)
add_subdirectory(primjerASSIMP)
add_subdirectory(primjerOpenGL)
add_subdirectory(trajectory)
