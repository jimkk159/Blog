#!/bin/bash
#Stopping existing node servers
echo "Stopping any existing node servers"
# Get the process ID (PID) of the Node process
PID=$(pgrep -f "node")
# Check if the Node process is running
if [ -n "$PID" ]; then
  # If the process ID is not empty, kill the Node process
  echo "Killing node process with PID $PID"
  pkill -f node
else
  echo "Node process is not running"
fi