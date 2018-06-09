# pipethrough

A service that takes files via a HTTP POST, mounts them to a specified Docker image, runs it and returns the outputs.

Form label is the mounting path.

# Configuration

| Env | Meaning |
| IMAGE | Image to execute |
| PULL_IMAGE | Try to pull image |
| CMD | Command to execute |